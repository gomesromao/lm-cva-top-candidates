// Server-side availability sanitization.
//
// A talent is dropped from the page when their Workable email matches
// any of email / communication_email / wise_email of a Coconut Hub user
// with role = 'va' (i.e. they're on payroll => hired).
//
// This runs inside ISR revalidation (see app page: revalidate = 3600),
// so hired VAs disappear automatically within an hour, no redeploy needed.
// Talents without a workableEmail are kept (fail-open) but reported so
// the gap is visible in logs.

import { createClient } from "@supabase/supabase-js";
import { TALENTS, Talent } from "@/data/talents";

const HUB_URL = process.env.HUB_SUPABASE_URL;
const HUB_KEY = process.env.HUB_SUPABASE_SERVICE_ROLE_KEY;

export async function getAvailableTalents(): Promise<{
  talents: Talent[];
  lastChecked: string;
}> {
  const lastChecked = new Date().toISOString();

  const emails = TALENTS.map((t) => (t.workableEmail || "").trim().toLowerCase()).filter(Boolean);

  // No emails configured yet, or Hub creds missing -> serve full list (fail-open).
  if (emails.length === 0 || !HUB_URL || !HUB_KEY) {
    if (!HUB_URL || !HUB_KEY) {
      console.warn("[sanitize] HUB env vars missing - serving unfiltered list");
    }
    return { talents: TALENTS, lastChecked };
  }

  try {
    const hub = createClient(HUB_URL, HUB_KEY, { auth: { persistSession: false } });

    // Hub `users` is small (<300 rows), one query per email column keeps
    // us well under the PostgREST 1,000-row server cap.
    const hired = new Set<string>();
    for (const col of ["email", "communication_email", "wise_email"] as const) {
      const { data, error } = await hub
        .from("users")
        .select(`${col}`)
        .eq("role", "va")
        .in(col, emails);
      if (error) {
        console.error(`[sanitize] Hub query failed on ${col}:`, error.message);
        continue;
      }
      for (const row of (data ?? []) as Record<string, string | null>[]) {
        const v = row[col];
        if (v) hired.add(v.trim().toLowerCase());
      }
    }

    const available = TALENTS.filter((t) => {
      const e = (t.workableEmail || "").trim().toLowerCase();
      if (!e) {
        console.warn(`[sanitize] talent ${t.id} (${t.name}) has no workableEmail - kept by default`);
        return true;
      }
      const isHired = hired.has(e);
      if (isHired) console.info(`[sanitize] dropping hired talent ${t.id} (${t.name})`);
      return !isHired;
    });

    return { talents: available, lastChecked };
  } catch (err) {
    console.error("[sanitize] unexpected failure - serving unfiltered list:", err);
    return { talents: TALENTS, lastChecked };
  }
}
