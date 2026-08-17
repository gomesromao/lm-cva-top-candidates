// Server-side availability sanitization. Runs on Vercel inside ISR
// revalidation (hourly) — hired and on-trial VAs drop automatically.
//
// Rule (confirmed against Hub schema):
//   A talent is UNAVAILABLE when their Workable email matches a Hub user
//   (email / communication_email / wise_email) who has at least one
//   va_client_assignments row with is_active = true AND
//   deal_stage IN ('active', 'trial').
//
//   Floating VAs and VAs with no active assignment stay on the page —
//   they are exactly the available inventory.
//
// Talents without a workableEmail are kept (fail-open) but logged.

import { createClient } from "@supabase/supabase-js";
import { TALENTS, Talent } from "@/data/talents";

const HUB_URL = process.env.HUB_SUPABASE_URL;
const HUB_KEY = process.env.HUB_SUPABASE_SERVICE_ROLE_KEY;

const UNAVAILABLE_STAGES = ["active", "trial"];

export async function getAvailableTalents(): Promise<{
  talents: Talent[];
  lastChecked: string;
}> {
  const lastChecked = new Date().toISOString();

  const emails = TALENTS.map((t) => (t.workableEmail || "").trim().toLowerCase()).filter(Boolean);

  if (emails.length === 0 || !HUB_URL || !HUB_KEY) {
    if (!HUB_URL || !HUB_KEY) {
      console.warn("[sanitize] HUB env vars missing - serving unfiltered list");
    }
    return { talents: TALENTS, lastChecked };
  }

  try {
    const hub = createClient(HUB_URL, HUB_KEY, { auth: { persistSession: false } });

    // Step 1: resolve emails -> Hub user ids (checking all 3 email columns).
    // users table is small (<300 rows), well under the PostgREST 1,000-row cap.
    const emailToUserIds = new Map<string, string[]>();
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
        const e = v.trim().toLowerCase();
        userIdToEmail.set(row.id, e);
        emailToUserIds.set(e, [...(emailToUserIds.get(e) ?? []), row.id]);
      }
    }

    const matchedUserIds = Array.from(userIdToEmail.keys());
    const unavailableEmails = new Set<string>();

    // Step 2: which of those users have an active placement or trial?
    if (matchedUserIds.length > 0) {
      const { data, error } = await hub
        .from("va_client_assignments")
        .select("va_id, deal_stage, is_active")
        .in("va_id", matchedUserIds)
        .eq("is_active", true)
        .in("deal_stage", UNAVAILABLE_STAGES);
      if (error) {
        console.error("[sanitize] Hub assignments query failed:", error.message);
      } else {
        for (const row of (data ?? []) as { va_id: string }[]) {
          const e = userIdToEmail.get(row.va_id);
          if (e) unavailableEmails.add(e);
        }
      }
    }

    const available = TALENTS.filter((t) => {
      const e = (t.workableEmail || "").trim().toLowerCase();
      if (!e) {
        console.warn(`[sanitize] talent ${t.id} (${t.name}) has no workableEmail - kept by default`);
        return true;
      }
      const unavailable = unavailableEmails.has(e);
      if (unavailable) console.info(`[sanitize] dropping talent ${t.id} (${t.name}) - active/trial assignment`);
      return !unavailable;
    });

    return { talents: available, lastChecked };
  } catch (err) {
    console.error("[sanitize] unexpected failure - serving unfiltered list:", err);
    return { talents: TALENTS, lastChecked };
  }
}
