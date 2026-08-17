// POST /api/intro  { email, candidateId, candidateName, source? }
//
// The real conversion event. Appends the intro request to the existing
// contact's source_info (additive only) and pings the sales channel.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { email?: string; candidateId?: string; candidateName?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase().slice(0, 200);
  const candidateId = (body.candidateId || "").trim().slice(0, 40).replace(/[^a-z0-9-]/gi, "");
  const candidateName = (body.candidateName || "").trim().slice(0, 80);
  const source = (body.source || "").trim().slice(0, 60).replace(/[^a-z0-9-_]/gi, "");

  if (!email || !candidateId) {
    return NextResponse.json({ ok: false, error: "Missing fields." }, { status: 400 });
  }

  const OS_URL = process.env.OS_SUPABASE_URL;
  const OS_KEY = process.env.OS_SUPABASE_SERVICE_ROLE_KEY;

  if (OS_URL && OS_KEY) {
    try {
      const os = createClient(OS_URL, OS_KEY, { auth: { persistSession: false } });
      const { data: existing } = await os
        .from("contacts")
        .select("id, source_info")
        .eq("email", email)
        .maybeSingle();
      if (existing) {
        const note = `Intro requested: ${candidateName || candidateId} (${candidateId}) — ${new Date().toISOString().slice(0, 10)}`;
        await os
          .from("contacts")
          .update({
            source_info: existing.source_info ? `${existing.source_info} | ${note}` : note,
          })
          .eq("id", existing.id);
      }
    } catch (err) {
      console.error("[intro] OS update failed:", err);
    }
  }

  const hook = process.env.SLACK_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `:fire: *Intro request!*\n${email} wants an intro to *${candidateName || candidateId}*${source ? `\nSource: /${source}` : ""}\nProfile: https://workable-profile.lovable.app/candidate/${candidateId}`,
        }),
      });
    } catch (err) {
      console.error("[intro] Slack notify failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
