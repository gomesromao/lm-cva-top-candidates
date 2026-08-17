# Coconut VA — Top Candidates Page

Public talent showcase with a soft email gate. Funnel: podcast / LinkedIn → this page → 3 free profiles → email gate → full list → intro request → sales call.

**Live at:** `talent.coconutva.com` (Vercel)

## How it works

- **3 profiles fully open**, the rest visibly blurred with the gate form overlaid. On submit the blur clears in place — no reload, no redirect.
- **Leads land in Coconut OS** (`contacts`, `lead_tag = 'LM - Top talents'`). `contacts.email` is UNIQUE in OS, so the API upserts: existing contacts are only patched on NULL fields (never overwrites CRM data) and get the visit appended to `source_info`.
- **Hired-VA sanitization** runs server-side on every ISR revalidation (hourly): each talent's Workable email (server-only, never sent to the browser) is checked against Coconut Hub `users` (`email` / `communication_email` / `wise_email`, `role = 'va'`). Matches drop off the page automatically. Fail-open: if Hub is unreachable or an email is missing, the talent stays and a warning is logged.
- **Vanity URLs per podcast:** `talent.coconutva.com/showname` — the first path segment is captured as the traffic source and stored on the contact + tracking events.
- **Returning visitors aren't re-gated:** cookie + localStorage flag.
- **Tracking:** `page_view → scroll_to_gate → form_submit → intro_request` via `/api/track`. Writes to OS table `lm_top_talents_events` (`sql/os_tracking_table.sql` — create only after approval; the route no-ops safely until then).

## Setup

1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in the keys.
3. Fill `workableEmail` for each talent in `data/talents.ts`:
   ```
   WORKABLE_API_KEY=xxx npm run fetch-emails
   ```
   then paste the printed emails into the file.
4. `npm run dev`

## Deploy (Vercel)

1. New GitHub repo → import in Vercel as a new project.
2. Set the env vars from `.env.example` in Vercel (Production).
3. Add domain `talent.coconutva.com` in Vercel → add the CNAME in the Wix DNS panel pointing to `cname.vercel-dns.com`.

## Env vars

| Var | Purpose |
|---|---|
| `OS_SUPABASE_URL` / `OS_SUPABASE_SERVICE_ROLE_KEY` | Lead upsert into Coconut OS contacts |
| `HUB_SUPABASE_URL` / `HUB_SUPABASE_SERVICE_ROLE_KEY` | Hired-VA sanitization (server-side only) |
| `SLACK_WEBHOOK_URL` | Sales-channel notifications for unlocks + intro requests |
| `WORKABLE_API_KEY` | Only for `scripts/fetch-emails.mjs` (not used at runtime) |

**Security note:** service-role keys live only in Vercel server env and are used exclusively inside API routes / server components. If we want to avoid a Hub service key in this project entirely, the alternative is a `SECURITY DEFINER` RPC in Hub (`is_email_hired(text[])`) granted to a dedicated limited key — flagged as a v2 hardening option.

## Privacy checklist (from the brief — confirm before launch)

- [ ] Every operator has explicitly agreed to be featured
- [ ] Photos have separate, specific consent (default: remove `photoUrl` if unsure)
- [ ] Cards show first name + last initial only; no employers, no exact location, no rates
- [ ] Removal requests honored fast (footer link → hr@coconutva.com)

## TODOs before launch

- [ ] Fill `workableEmail` for all 12 talents (`npm run fetch-emails`)
- [ ] Fill `experience`, `tools`, `summary` per talent (brief requires them on cards)
- [ ] Confirm Angela's status — Hub has an active VA named Angela; if it's her, she's the sanitization test case
- [ ] Confirm photo consent per talent
- [ ] Approve + run `sql/os_tracking_table.sql` on OS
- [ ] Lovable prompt to add the "LM - Top talents" tab in OS Contacts (see project notes)
