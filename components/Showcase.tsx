"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicTalent } from "@/data/talents";

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
          {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} — ${t.role}`} loading="lazy" />}
          <span className="t-watch">
            <span className="t-play-ic" aria-hidden="true" />
            Watch intro
          </span>
        </a>
      ) : (
        <div className="t-media">
          <span className="t-ph" aria-hidden="true">{t.name.charAt(0)}</span>
          {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} — ${t.role}`} loading="lazy" />}
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

export default function Showcase({
  talents,
  freeCount,
  lastChecked,
  source,
  initiallyUnlocked,
}: {
  talents: PublicTalent[];
  freeCount: number;
  lastChecked: string;
  source: string;
  initiallyUnlocked: boolean;
}) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [intro, setIntro] = useState<Record<string, "idle" | "sending" | "done">>({});
  const gateRef = useRef<HTMLDivElement>(null);
  const scrollTracked = useRef(false);

  const free = talents.slice(0, freeCount);
  const gated = talents.slice(freeCount);

  useEffect(() => {
    if (localStorage.getItem(LS_KEY) === "1") setUnlocked(true);
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
      localStorage.setItem(LS_KEY, "1");
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
    } catch {
      setIntro((s) => ({ ...s, [t.id]: "idle" }));
    }
  }

  const updatedDate = new Date(lastChecked).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
          <h1>Top candidates, in the open</h1>
          <p className="lead">
            A sample of the operators available right now. No pitch, no call required. Just look.
          </p>
          <p className="last-updated">Availability last checked {updatedDate}</p>
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
                    <h2>{gated.length} more candidates</h2>
                    <p>Tell us who you are and the full list opens right here.</p>
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

      <footer className="site-footer">
        <div className="footer-row">
          <span>© {new Date().getFullYear()} Coconut VA</span>
          <span>
            Want to be removed from this page?{" "}
            <a href="mailto:hr@coconutva.com">Email us</a> — we act fast.
          </span>
        </div>
      </footer>
    </>
  );
}
