"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Sections from "../components/Sections";

const Canvas3D = dynamic(() => import("../components/Canvas3D"), {
  ssr: false,
  loading: () => (
    <div style={{
      position: "fixed", inset: 0, background: "#070907",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 999, color: "rgba(235,240,236,0.5)",
      fontFamily: "serif", fontSize: "1rem", letterSpacing: "0.2em",
      textTransform: "uppercase"
    }}>
      Initializing BerryX Systems...
    </div>
  )
});

export default function Home() {
  const scrollProgressRef = useRef(0);
  const progressBarRef = useRef(null);

  // Use native scroll event — no Lenis dependency issues
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      scrollProgressRef.current = progress;
      if (progressBarRef.current) {
        progressBarRef.current.style.height = `${progress * 100}%`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed 3D Canvas behind everything */}
      <Canvas3D progressRef={scrollProgressRef} />

      {/* Fixed header */}
      <header className="header-brand">
        <div className="header-logo" />
        <span className="header-name">BERRYX SYSTEMS</span>
      </header>

      {/* Scroll progress indicator */}
      <div className="scroll-indicator">
        <div className="scroll-bar-container">
          <div ref={progressBarRef} className="scroll-bar-progress" />
        </div>
        <span className="scroll-text">Scroll</span>
      </div>

      {/* The scrollable story overlay */}
      <Sections />
    </>
  );
}
