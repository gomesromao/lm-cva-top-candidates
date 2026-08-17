// POST /api/unlock  { name, email, source? }
//
// 1. Validates email + blocks disposable domains
// 2. Upserts the lead into Coconut OS `contacts` with lead_tag 'LM - Top talents'
//    - contacts.email is UNIQUE in OS: if the contact already exists we only
//      fill fields that are currently NULL (never overwrite existing CRM data)
// 3. Posts a Slack notification to the sales channel
// 4. Sets an httpOnly-ish cookie so returning visitors aren't re-gated
//    (client also keeps a localStorage flag)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notifySlack } from "@/lib/slack";

export const runtime = "nodejs";

const LEAD_TAG = "LM - Top talents";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "sharklasers.com", "trashmail.com",
  "getnada.com", "dispostable.com", "maildrop.cc", "fakeinbox.com",
  "throwawaymail.com", "mytemp.email", "mail.tm", "moakt.com",
]);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name || "").trim().slice(0, 120);
  const email = (body.email || "").trim().toLowerCase().slice(0, 200);
  const source = (body.source || "").trim().slice(0, 60).replace(/[^a-z0-9-_]/gi, "");

  if (!name || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid name and email." }, { status: 400 });
  }
  const domain = email.split("@")[1];
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return NextResponse.json({ ok: false, error: "Please use your work or personal email." }, { status: 400 });
  }

  const OS_URL = process.env.OS_SUPABASE_URL;
  const OS_KEY = process.env.OS_SUPABASE_SERVICE_ROLE_KEY;

  if (OS_URL && OS_KEY) {
    try {
      const os = createClient(OS_URL, OS_KEY, { auth: { persistSession: false } });

      const [firstName, ...rest] = name.split(/\s+/);
      const lastName = rest.join(" ") || null;
      const sourceInfo = `Top Talents page${source ? ` (/${source})` : ""} — unlocked ${new Date().toISOString().slice(0, 10)}`;

      const { data: existing, error: selErr } = await os
        .from("contacts")
        .select("id, lead_tag, source_ref, source_info, full_name")
        .eq("email", email)
        .maybeSingle();
      if (selErr) throw selErr;

      if (!existing) {
        const { error: insErr } = await os.from("contacts").insert({
          email,
          first_name: firstName,
          last_name: lastName,
          full_name: name,
          contact_type: "lead",
          lead_tag: LEAD_TAG,
          source_ref: source ? `top-talents/${source}` : "top-talents",
          source_info: sourceInfo,
          utm_source: source || "top-talents",
          utm_medium: "landing-page",
          utm_campaign: "top-talents",
        });
        if (insErr) throw insErr;
      } else {
        // Existing contact: additive update only — never overwrite CRM data.
        const patch: Record<string, string> = {};
        if (!existing.lead_tag) patch.lead_tag = LEAD_TAG;
        if (!existing.source_ref) patch.source_ref = source ? `top-talents/${source}` : "top-talents";
        patch.source_info = existing.source_info
          ? `${existing.source_info} | ${sourceInfo}`
          : sourceInfo;
        const { error: updErr } = await os.from("contacts").update(patch).eq("id", existing.id);
        if (updErr) throw updErr;
      }
    } catch (err) {
      // Never block the visitor because of a CRM hiccup — log and continue.
      console.error("[unlock] OS sync failed:", err);
    }
  } else {
    console.warn("[unlock] OS env vars missing - lead not synced");
  }

  // Slack notification (best-effort; webhook or bot token — see lib/slack.ts)
  await notifySlack(
    `:coconut: *New Top Talents lead*\n*${name}* — ${email}${source ? `\nSource: /${source}` : ""}`
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set("cva_tt_unlocked", "1", {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
