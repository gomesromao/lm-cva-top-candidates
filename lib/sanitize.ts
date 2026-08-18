// Server-side availability sanitization. Runs on Vercel inside ISR
// revalidation (hourly).
//
// Rules (confirmed against Hub schema):
//   - deal_stage = 'active' (is_active = true)  -> the talent is NOT removed:
//     it is converted to a "recently hired" card (fully blurred + badge),
//     which is exactly the urgency signal Tyler asked for.
//   - deal_stage = 'trial'  (is_active = true)  -> dropped entirely.
//     Trials are not hires; they never show a "hired" badge.
//   - Floating VAs / no active assignment -> stay as available inventory.
//   - Manually flagged entries (status: "hired" in data/talents.ts) pass
//     through untouched.
//
// Talents without a workableEmail are kept as-is (fail-open) but logged.

import { createClient } from "@supabase/supabase-js";
import { TALENTS, Talent } from "@/data/talents";

const HUB_URL = process.env.HUB_SUPABASE_URL;
const HUB_KEY = process.env.HUB_SUPABASE_SERVICE_ROLE_KEY;

export async function getAvailableTalents(): Promise<{ talents: Talent[] }> {
  const emails = TALENTS
    .filter((t) => t.status !== "hired")
    .map((t) => (t.workableEmail || "").trim().toLowerCase())
    .filter(Boolean);

  if (emails.length === 0 || !HUB_URL || !HUB_KEY) {
    if (!HUB_URL || !HUB_KEY) {
      console.warn("[sanitize] HUB env vars missing - serving unfiltered list");
    }
    return { talents: TALENTS };
  }

  try {
    const hub = createClient(HUB_URL, HUB_KEY, { auth: { persistSession: false } });

    // Step 1: resolve emails -> Hub user ids (checking all 3 email columns).
    // users table is small (<300 rows), well under the PostgREST 1,000-row cap.
    const userIdToEmail = new Map<string, string>();

    for (const col of ["email", "communication_email", "wise_email"] as const) {
      const { data, error } = await hub
        .from("users")
        .select(`id, ${col}`)
        .in(col, emails);
      if (error) {
        console.error(`[sanitize] Hub users query failed on ${col}:`, error.message);
        continue;
      }
      for (const row of (data ?? []) as { id: string; [k: string]: string | null }[]) {
        const v = row[col];
        if (!v) continue;
        userIdToEmail.set(row.id, v.trim().toLowerCase());
      }
    }

    const matchedUserIds = Array.from(userIdToEmail.keys());
    // email -> "hired" (active) or "gone" (trial)
    const emailFate = new Map<string, { fate: "hired" | "gone"; date?: string }>();

    // Step 2: which of those users have an active placement or trial?
    if (matchedUserIds.length > 0) {
      const { data, error } = await hub
        .from("va_client_assignments")
        .select("va_id, deal_stage, is_active, hiring_date, assigned_date")
        .in("va_id", matchedUserIds)
        .eq("is_active", true)
        .in("deal_stage", ["active", "trial"]);
      if (error) {
        console.error("[sanitize] Hub assignments query failed:", error.message);
      } else {
        for (const row of (data ?? []) as {
          va_id: string;
          deal_stage: string;
          hiring_date: string | null;
          assigned_date: string | null;
        }[]) {
          const e = userIdToEmail.get(row.va_id);
          if (!e) continue;
          if (row.deal_stage === "active") {
            // active always wins over trial for the same VA
            emailFate.set(e, { fate: "hired", date: row.hiring_date ?? row.assigned_date ?? undefined });
          } else if (!emailFate.has(e)) {
            emailFate.set(e, { fate: "gone" });
          }
        }
      }
    }

    const result: Talent[] = [];
    for (const t of TALENTS) {
      if (t.status === "hired") {
        result.push(t); // manual hired card, keep as-is
        continue;
      }
      const e = (t.workableEmail || "").trim().toLowerCase();
      if (!e) {
        console.warn(`[sanitize] talent ${t.id} (${t.name}) has no workableEmail - kept by default`);
        result.push(t);
        continue;
      }
      const fate = emailFate.get(e);
      if (!fate) {
        result.push(t); // available
      } else if (fate.fate === "hired") {
        console.info(`[sanitize] talent ${t.id} (${t.name}) hired - converting to blurred card`);
        result.push({ ...t, status: "hired", hiredDate: fate.date });
      } else {
        console.info(`[sanitize] dropping talent ${t.id} (${t.name}) - on trial`);
      }
    }

    return { talents: result };
  } catch (err) {
    console.error("[sanitize] unexpected failure - serving unfiltered list:", err);
    return { talents: TALENTS };
  }
}
