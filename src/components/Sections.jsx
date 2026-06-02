"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";

// ─── CHAPTER DEFINITIONS ────────────────────────────────────────────────
const CHAPTERS = [
  { id: "origin",       label: "Origin",       scene: 0  },
  { id: "mission",      label: "Mission",      scene: 1  },
  { id: "intelligence", label: "Intelligence", scene: 2  },
  { id: "services",     label: "Services",     scene: 3  },
  { id: "sectors",      label: "Sectors",      scene: 7  },
  { id: "philosophy",   label: "Philosophy",   scene: 8  },
  { id: "contact",      label: "Contact",      scene: 9  },
];

// ─── SCENE SECTION ───────────────────────────────────────────────────────
function SceneSection({ children, align = "center", id, style = {} }) {
  return (
    <section
      id={id}
      data-chapter={id}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "left"  ? "flex-start"
          : align === "right" ? "flex-end"
          : "center",
        padding:
          align === "left"  ? "0 0 0 8%"
          : align === "right" ? "0 8% 0 0"
          : "0 5%",
        position: "relative",
        zIndex: 10,
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ─── FADE IN ─────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: false, margin: "-12% 0px -18% 0px" }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ pointerEvents: "auto" }}
    >
      {children}
    </motion.div>
  );
}

// ─── CHAPTER NAVIGATOR ───────────────────────────────────────────────────
function ChapterNav({ activeChapter, onNavigate }) {
  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      <div className="chapter-nav-line" />
      {CHAPTERS.map((ch) => (
        <button
          key={ch.id}
          className={`chapter-nav-item ${activeChapter === ch.id ? "active" : ""}`}
          onClick={() => onNavigate(ch.scene)}
          aria-label={`Jump to ${ch.label}`}
          title={ch.label}
        >
          <span className="chapter-nav-dot" />
          <span className="chapter-nav-label">{ch.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── CONSULTATION MODAL ──────────────────────────────────────────────────
function Modal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]   = useState(null);
  const fp = (id) => ({ onFocus: () => setFocused(id), onBlur: () => setFocused(null) });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: e.target["m-name"].value,
      org: e.target["m-org"].value,
      email: e.target["m-email"].value,
      role: e.target["m-role"].value,
      industry: e.target["m-industry"].value,
      challenge: e.target["m-challenge"].value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); onClose(); }, 4000);
      } else {
        alert("There was an issue sending your request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-backdrop ${isOpen ? "open" : ""}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">&times;</button>

        {submitted ? (
          <div className="success-msg">
            <div className="success-icon">✦</div>
            <h3>Assessment Initiated</h3>
            <p>Our architects will contact you within one business day to begin your operational intelligence assessment.</p>
          </div>
        ) : (
          <>
            <div className="modal-eyebrow">BerryX Systems · Strategic Advisory</div>
            <h2 className="modal-title">Request an AI Readiness Assessment</h2>
            <p className="modal-sub">
              Tell us about your operational environment. We will identify where intelligence creates the highest impact — at no cost, no obligation.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row-pair">
                <div className={`form-row ${focused === "name" ? "focused" : ""}`}>
                  <label htmlFor="m-name">Full Name</label>
                  <input id="m-name" type="text" required placeholder="Your name" {...fp("name")} />
                </div>
                <div className={`form-row ${focused === "org" ? "focused" : ""}`}>
                  <label htmlFor="m-org">Organisation</label>
                  <input id="m-org" type="text" required placeholder="Company or institution" {...fp("org")} />
                </div>
              </div>
              <div className="form-row-pair">
                <div className={`form-row ${focused === "email" ? "focused" : ""}`}>
                  <label htmlFor="m-email">Work Email</label>
                  <input id="m-email" type="email" required placeholder="you@company.com" {...fp("email")} />
                </div>
                <div className={`form-row ${focused === "role" ? "focused" : ""}`}>
                  <label htmlFor="m-role">Your Title</label>
                  <input id="m-role" type="text" placeholder="e.g. VP Operations, CTO" {...fp("role")} />
                </div>
              </div>
              <div className={`form-row ${focused === "industry" ? "focused" : ""}`}>
                <label htmlFor="m-industry">Industry</label>
                <select id="m-industry" defaultValue="" {...fp("industry")}>
                  <option value="" disabled>Select your sector</option>
                  <option>Manufacturing</option>
                  <option>Energy &amp; Utilities</option>
                  <option>Logistics &amp; Supply Chain</option>
                  <option>Financial Services</option>
                  <option>Agriculture &amp; Agri-tech</option>
                  <option>Public Sector &amp; Government</option>
                  <option>Healthcare &amp; Life Sciences</option>
                  <option>Other</option>
                </select>
              </div>
              <div className={`form-row ${focused === "challenge" ? "focused" : ""}`}>
                <label htmlFor="m-challenge">Where does intelligence matter most in your operations?</label>
                <textarea id="m-challenge" rows={4}
                  placeholder="Describe the decision, process, or environment where better intelligence would create the most impact..."
                  {...fp("challenge")} />
              </div>
              <button type="submit" className="form-submit" id="submit-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? "Sending..." : "Request AI Readiness Assessment"}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="form-footnote">No cost · No commitment · Response within one business day</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN SECTIONS ───────────────────────────────────────────────────────
export default function Sections() {
  const [modalOpen,    setModalOpen]    = useState(false);
  const [activeChapter, setActiveChapter] = useState("origin");
  const scenesRef = useRef([]);

  // Register a scene element for scrollspy
  const registerScene = (el, idx) => { scenesRef.current[idx] = el; };

  // Scroll to a specific scene by index (0-based scene index = scene number)
  const navigateTo = (sceneIndex) => {
    // Each scene is 100vh. Total page = 1000vh. Scene 0 = top.
    const vh = window.innerHeight;
    window.scrollTo({ top: sceneIndex * vh, behavior: "smooth" });
  };

  // Scroll-spy: update activeChapter based on scroll position
  useEffect(() => {
    const SCENE_COUNT = 10;
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const maxScroll  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = maxScroll > 0 ? scrollTop / maxScroll : 0;
      const sceneIndex = Math.floor(progress * SCENE_COUNT);

      // Map scene index → chapter
      if      (sceneIndex <= 0) setActiveChapter("origin");
      else if (sceneIndex === 1) setActiveChapter("mission");
      else if (sceneIndex === 2) setActiveChapter("intelligence");
      else if (sceneIndex >= 3 && sceneIndex <= 6) setActiveChapter("services");
      else if (sceneIndex === 7) setActiveChapter("sectors");
      else if (sceneIndex === 8) setActiveChapter("philosophy");
      else                       setActiveChapter("contact");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {/* ── CHAPTER NAVIGATOR ── */}
      <ChapterNav activeChapter={activeChapter} onNavigate={navigateTo} />

      {/* ── SCROLL STORY — 10 × 100vh = 1000vh ── */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 1 · ORIGIN  (Scene 1)
            The very first thing the user sees — big, cinematic.
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="origin">
          <FadeIn>
            <div className="narr">
              <p className="narr-tag">BerryX Systems &mdash; Industrial Intelligence</p>
              <h1 className="narr-headline">
                Where others see<br />complexity, we see the<br />seed of a <em>better decision.</em>
              </h1>
              <p className="narr-sub">
                AI systems for enterprises operating in complex, regulated,<br />and mission-critical environments.
              </p>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 2 · MISSION  (Scene 2)
            Who BerryX Systems is.
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="mission">
          <FadeIn>
            <div className="narr">
              <p className="narr-tag">Our Mission</p>
              <h2 className="narr-headline">
                The intelligence layer<br />powering the next<br />generation of <em>industrial infrastructure.</em>
              </h2>
              <p className="narr-sub">
                We combine artificial intelligence, operational data, and deep domain expertise<br />
                to help organizations make better decisions — where those decisions truly matter.
              </p>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 3 · INTELLIGENCE  (Scene 3)
            Architecture statement.
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="intelligence">
          <FadeIn>
            <div className="narr">
              <p className="narr-tag">The Architecture</p>
              <h2 className="narr-headline">
                We don&apos;t build tools.<br />We become the<br /><em>intelligence layer.</em>
              </h2>
              <p className="narr-sub">
                Built for complexity. Designed for consequence.
              </p>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 4 · SERVICES  (Scenes 4a–4d)
            Four open chapter-cards — no boxes, no borders.
            ═══════════════════════════════════════════════════ */}

        {/* 4a — Decision Intelligence */}
        <SceneSection id="services" align="left">
          <FadeIn>
            <div className="chapter-card">
              <span className="chapter-num">01</span>
              <p className="chapter-eyebrow">Decision Intelligence</p>
              <h3 className="chapter-title">Operational Decision Systems</h3>
              <p className="chapter-desc">
                AI that sharpens every consequential decision — procurement, compliance, risk, and resource allocation — in environments where error is not an option.
              </p>
              <div className="chapter-chips">
                <span>Procurement</span>
                <span>Compliance</span>
                <span>Risk Management</span>
                <span>Resource Allocation</span>
              </div>
            </div>
          </FadeIn>
        </SceneSection>

        {/* 4b — Domain-Specific AI */}
        <SceneSection align="right">
          <FadeIn>
            <div className="chapter-card">
              <span className="chapter-num">02</span>
              <p className="chapter-eyebrow">Domain-Specific AI</p>
              <h3 className="chapter-title">AI Native to Your Sector</h3>
              <p className="chapter-desc">
                Not adapted — native. Systems engineered to understand the regulatory constraints, operational rhythms, and data structures unique to your environment.
              </p>
              <div className="chapter-chips">
                <span>Manufacturing</span>
                <span>Energy</span>
                <span>Logistics</span>
                <span>Financial Services</span>
              </div>
            </div>
          </FadeIn>
        </SceneSection>

        {/* 4c — Custom AI Products */}
        <SceneSection align="left">
          <FadeIn>
            <div className="chapter-card">
              <span className="chapter-num">03</span>
              <p className="chapter-eyebrow">Custom AI Products</p>
              <h3 className="chapter-title">Intelligent Platforms &amp; Portals</h3>
              <p className="chapter-desc">
                From management dashboards to autonomous workflow engines — we design and build complete AI products owned entirely by your organisation, end-to-end.
              </p>
              <div className="chapter-chips">
                <span>Workflow Automation</span>
                <span>Analytical Dashboards</span>
                <span>Predictive Operations</span>
              </div>
            </div>
          </FadeIn>
        </SceneSection>

        {/* 4d — Strategic Advisory */}
        <SceneSection align="right">
          <FadeIn>
            <div className="chapter-card chapter-card--amber chapter-card--right">
              <span className="chapter-num">04</span>
              <p className="chapter-eyebrow">Strategic Advisory</p>
              <h3 className="chapter-title">AI Readiness Assessment</h3>
              <p className="chapter-desc">
                Before a single line of code, our architects map your operational intelligence potential — at no cost, no obligation. This is where your transformation begins.
              </p>
              <div className="chapter-chips">
                <span>No Cost</span>
                <span>No Obligation</span>
                <span>Expert-Led</span>
              </div>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 5 · SECTORS  (Scene 8)
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="sectors">
          <FadeIn>
            <div className="narr">
              <p className="narr-tag">The Outcome</p>
              <h2 className="narr-headline">
                The next generation<br />of industrial infrastructure<br />runs on <em>intelligence.</em>
              </h2>
              <div className="sector-grid">
                {[
                  "Manufacturing", "Energy & Utilities",
                  "Logistics", "Financial Services",
                  "Agriculture", "Public Sector",
                ].map(s => (
                  <span key={s} className="sector-tag">{s}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 6 · PHILOSOPHY  (Scene 9)
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="philosophy">
          <FadeIn>
            <div className="narr">
              <p className="narr-tag">The Philosophy</p>
              <h2 className="narr-headline">
                Intelligence doesn&apos;t just<br />optimize. It <em>protects.</em><br />It <em>predicts. It decides.</em>
              </h2>
              <p className="narr-sub">BerryX Systems is that intelligence.</p>
            </div>
          </FadeIn>
        </SceneSection>

        {/* ══════════════════════════════════════════════════════
            CHAPTER 7 · CONTACT  (Scene 10)
            ═══════════════════════════════════════════════════ */}
        <SceneSection id="contact">
          <FadeIn>
            <div className="narr narr--cta">
              <p className="narr-tag">Begin Here</p>
              <h2 className="narr-headline">
                Your operations deserve<br />intelligence built for<br />their <em>complexity.</em>
              </h2>
              <p className="narr-sub">AI Readiness Assessment &mdash; no cost, no commitment.</p>

              <button
                className="cta-btn"
                id="book-consultation-btn"
                onClick={() => setModalOpen(true)}
              >
                Request an Assessment
              </button>

              <div className="industry-list">
                <span>Manufacturing</span>
                <span className="dot">&middot;</span>
                <span>Energy</span>
                <span className="dot">&middot;</span>
                <span>Logistics</span>
                <span className="dot">&middot;</span>
                <span>Financial Services</span>
                <span className="dot">&middot;</span>
                <span>Agriculture</span>
                <span className="dot">&middot;</span>
                <span>Public Sector</span>
              </div>
            </div>
          </FadeIn>
        </SceneSection>

      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </MotionConfig>
  );
}
