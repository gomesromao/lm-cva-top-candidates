"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicTalent } from "@/data/talents";

import { UNLOCK_VERSION } from "@/lib/unlockVersion";

const LS_KEY = "cva_tt_unlocked";
const LS_EMAIL = "cva_tt_email";

function track(event: string, source: string, meta?: Record<string, unknown>) {
  try {
    navigator.sendBeacon?.(
      "/api/track",
      new Blob([JSON.stringify({ event, source, meta })], { type: "application/json" })
    ) ||
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, source, meta }),
        keepalive: true,
      });
  } catch {
    /* analytics must never break the page */
  }
}

function hiredLabel(iso?: string) {
  if (!iso) return "Recently hired";
  const d = new Date(iso + "T12:00:00Z");
  if (isNaN(d.getTime())) return "Recently hired";
  return `Hired ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function TalentCard({
  t,
  blurred,
  onIntro,
  introState,
}: {
  t: PublicTalent;
  blurred: boolean;
  onIntro: (t: PublicTalent) => void;
  introState: "idle" | "sending" | "done";
}) {
  // Recently hired: content fully blurred, badge on top, nothing clickable.
  if (t.status === "hired") {
    return (
      <article className="t-card hired-card" aria-hidden="true">
        <div className="hired-inner">
          <div className="t-media">
            <span className="t-ph" aria-hidden="true">{t.name.charAt(0)}</span>
            {t.photoUrl && <img src={t.photoUrl} alt="" loading="lazy" />}
          </div>
          <div className="t-body">
            <h3 className="t-name">{t.name}</h3>
            <p className="t-role">{t.role}</p>
            <div className="t-actions">
              <span className="t-btn ghost">View profile</span>
              <span className="t-btn">Request an intro</span>
            </div>
          </div>
        </div>
        <div className="hired-overlay">
          <span className="hired-badge">{hiredLabel(t.hiredDate)}</span>
          <span className="hired-sub">No longer available</span>
        </div>
      </article>
    );
  }

  return (
    <article className="t-card" aria-hidden={blurred}>
      {t.loomUrl ? (
        <a
          className="t-media"
          href={blurred ? undefined : t.loomUrl}
          target="_blank"
          rel="noopener"
          tabIndex={blurred ? -1 : 0}
          aria-label={`Watch ${t.name}'s intro video`}
        >
          <span className="t-ph" aria-hidden="true">{t.name.charAt(0)}</span>
          {t.photoUrl && <img src={t.photoUrl} alt={`${t.name}, ${t.role}`} loading="lazy" />}
          {t.rate && <span className="t-rate">from {t.rate}<small>/mo</small></span>}
          <span className="t-watch">
            <span className="t-play-ic" aria-hidden="true" />
            Watch intro
          </span>
        </a>
      ) : (
        <div className="t-media">
          <span className="t-ph" aria-hidden="true">{t.name.charAt(0)}</span>
          {t.photoUrl && <img src={t.photoUrl} alt={`${t.name}, ${t.role}`} loading="lazy" />}
          {t.rate && <span className="t-rate">from {t.rate}<small>/mo</small></span>}
        </div>
      )}
      <div className="t-body">
        <h3 className="t-name">{t.name}</h3>
        <p className="t-role">{t.role}</p>
        {t.availability && <p className="t-meta">{t.availability}</p>}
        {t.experience && <p className="t-meta">{t.experience}</p>}
        {t.summary && <p className="t-summary">{t.summary}</p>}
        {t.tools && t.tools.length > 0 && (
          <p className="t-summary">Tools: {t.tools.join(", ")}</p>
        )}
        <div className="t-actions">
          <a
            className="t-btn ghost"
            href={blurred ? undefined : t.profileUrl}
            target="_blank"
            rel="noopener"
            tabIndex={blurred ? -1 : 0}
          >
            View profile
          </a>
          <button
            className={`t-btn ${introState === "done" ? "done" : ""}`}
            disabled={blurred || introState !== "idle"}
            onClick={() => onIntro(t)}
          >
            {introState === "done" ? "Request sent ✓" : introState === "sending" ? "Sending…" : "Request an intro"}
          </button>
        </div>
      </div>
    </article>
  );
}

const BOOK_URL =
  "https://calendly.com/conor-coconutva/30min?utm_source=candidates-intro";

export default function Showcase({
  talents,
  freeCount,
  source,
  initiallyUnlocked,
}: {
  talents: PublicTalent[];
  freeCount: number;
  source: string;
  initiallyUnlocked: boolean;
}) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [intro, setIntro] = useState<Record<string, "idle" | "sending" | "done">>({});
  const [introModal, setIntroModal] = useState<PublicTalent | null>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const scrollTracked = useRef(false);

  const available = talents.filter((t) => t.status !== "hired");
  const hired = talents.filter((t) => t.status === "hired");

  // Row 1 (open): the 3 free profiles, so the gate form shows up right
  // below the first row. Hired cards are mixed through the GATED grid;
  // their blur + badge is per-card, so leads see "Hired Aug X" crisp
  // even before unlocking. 6 available + 3 hired = 9 = clean rows of 3.
  const free: PublicTalent[] = available.slice(0, freeCount);
  const gated: PublicTalent[] = available.slice(freeCount);
  const mixPositions = [2, 4, 6]; // one hired per gated row; index 1 stays clear of the gate form
  hired.forEach((h, i) => {
    const pos = mixPositions[i] ?? gated.length;
    gated.splice(Math.min(pos, gated.length), 0, h);
  });

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === UNLOCK_VERSION) setUnlocked(true);
    track("page_view", source);
  }, [source]);

  // scroll_to_gate: fires once when the gate enters the viewport
  useEffect(() => {
    if (unlocked || !gateRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !scrollTracked.current) {
          scrollTracked.current = true;
          track("scroll_to_gate", source);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(gateRef.current);
    return () => obs.disconnect();
  }, [unlocked, source]);

  async function handleSubmit() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      localStorage.setItem(LS_KEY, UNLOCK_VERSION);
      localStorage.setItem(LS_EMAIL, email.trim().toLowerCase());
      track("form_submit", source);
      setUnlocked(true); // reveal in place — no reload, no redirect
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleIntro(t: PublicTalent) {
    const visitorEmail = localStorage.getItem(LS_EMAIL) || email.trim().toLowerCase();
    if (!visitorEmail) {
      // free profiles can request intros pre-gate: ask for the email inline
      const asked = window.prompt("What's your email so we can follow up?");
      if (!asked) return;
      localStorage.setItem(LS_EMAIL, asked.trim().toLowerCase());
    }
    setIntro((s) => ({ ...s, [t.id]: "sending" }));
    try {
      await fetch("/api/intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem(LS_EMAIL),
          candidateId: t.id,
          candidateName: t.name,
          source,
        }),
      });
      track("intro_request", source, { candidateId: t.id });
      setIntro((s) => ({ ...s, [t.id]: "done" }));
      setIntroModal(t); // let them book a call straight away
    } catch {
      setIntro((s) => ({ ...s, [t.id]: "idle" }));
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a href="https://www.coconutva.com" aria-label="Coconut VA">
            <img
              className="logo"
              src="https://mcusercontent.com/f446058f113961954b0efff8f/images/f080c206-2a38-2c82-7b9b-25560ab4a994.png"
              alt="Coconut VA"
            />
          </a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">
            <span className="pulse" />
            Available right now
          </span>
          <h1>This month&apos;s top candidates</h1>
          <p className="lead">
            These are the people our clients are asking about right now. Watch a short
            intro, dig into the full profile, and request an intro when someone stands out.
          </p>
        </div>
      </section>

      <section className="talent">
        <div className="t-wrap">
          {/* three full profiles — fully public, no gate */}
          <div className="t-grid">
            {free.map((t) => (
              <TalentCard
                key={t.id}
                t={t}
                blurred={false}
                onIntro={handleIntro}
                introState={intro[t.id] ?? "idle"}
              />
            ))}
          </div>

          {/* the rest: visibly there but blurred, form overlaid */}
          {gated.length > 0 && (
            <div ref={gateRef} className={`gate-zone ${unlocked ? "unlocked" : ""}`}>
              <div className="t-grid">
                {gated.map((t) => (
                  <TalentCard
                    key={t.id}
                    t={t}
                    blurred={!unlocked}
                    onIntro={handleIntro}
                    introState={intro[t.id] ?? "idle"}
                  />
                ))}
              </div>
              {!unlocked && (
                <div className="gate-overlay">
                  <div className="gate-card">
                    <h2>Unlock {gated.filter((g) => g.status !== "hired").length} more candidates</h2>
                    <p>Enter your email and the full list opens right here.</p>
                    <div className="gate-form">
                      <input
                        className="gate-input"
                        type="text"
                        placeholder="Full name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <input
                        className="gate-input"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      />
                      <button className="gate-submit" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Opening…" : "See all candidates"}
                      </button>
                      {error && <p className="gate-error">{error}</p>}
                    </div>
                    <p className="gate-privacy">
                      No spam, no phone calls. Just the list.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {introModal && (
        <div className="intro-modal-backdrop" onClick={() => setIntroModal(null)}>
          <div className="intro-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button className="intro-modal-close" aria-label="Close" onClick={() => setIntroModal(null)}>×</button>
            <h3>Request sent ✓</h3>
            <p>
              We&apos;ll reach out about {introModal.name} shortly. Want to move faster?
              Grab a time now and we&apos;ll bring the details.
            </p>
            <a
              className="t-btn modal-book"
              href={BOOK_URL}
              target="_blank"
              rel="noopener"
              onClick={() => track("intro_book_click", source, { candidateId: introModal.id })}
            >
              Book a call now
            </a>
            <button className="intro-modal-later" onClick={() => setIntroModal(null)}>
              I&apos;ll wait for the email
            </button>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Coconut VA</span>
          <span>
            Want to be removed from this page?{" "}
            <a href="mailto:hr@coconutva.com">Email us</a> and we act fast.
          </span>
        </div>
      </footer>
    </>
  );
}
