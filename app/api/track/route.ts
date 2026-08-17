// POST /api/track  { event, source?, meta? }
//
// Tracks the four funnel events from the brief:
//   page_view -> scroll_to_gate -> form_submit -> intro_request
//
// Writes to OS table `lm_top_talents_events` (see sql/os_tracking_table.sql).
// If the table doesn't exist yet, this silently no-ops — the page never breaks
// because of analytics.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set(["page_view", "scroll_to_gate", "form_submit", "intro_request"]);

export async function POST(req: NextRequest) {
  let body: { event?: string; source?: string; meta?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = (body.event || "").trim();
  if (!ALLOWED_EVENTS.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const source = (body.source || "").trim().slice(0, 60).replace(/[^a-z0-9-_]/gi, "") || null;

  const OS_URL = process.env.OS_SUPABASE_URL;
  const OS_KEY = process.env.OS_SUPABASE_SERVICE_ROLE_KEY;
  if (OS_URL && OS_KEY) {
    try {
      const os = createClient(OS_URL, OS_KEY, { auth: { persistSession: false } });
      await os.from("lm_top_talents_events").insert({
        event,
        source,
        meta: body.meta ?? null,
      });
    } catch {
      // table probably not created yet — intentional no-op
    }
  }
  return NextResponse.json({ ok: true });
}
