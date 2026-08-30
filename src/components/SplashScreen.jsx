import React, { useEffect, useState, useMemo } from "react";

const TOTAL_DURATION = 3000;
const BRAND_LETTERS = "Jansuraj".split("");

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  // Load Poppins from Fontsource CDN
  useEffect(() => {
    const weights = ["300", "400", "500"];
    const links = weights.map((w) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://cdn.jsdelivr.net/fontsource/css/poppins@latest/latin-${w}-normal.css`;
      document.head.appendChild(link);
      return link;
    });
    return () => links.forEach((l) => document.head.removeChild(l));
  }, []);

  const dust = useMemo(
    () =>
      Array.from({ length: 14 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
      })),
    []
  );

  useEffect(() => {
    const start = performance.now();
    let rafId;
    let pauseUntil = 0;
    let finished = false;

    function tick(now) {
      if (now < pauseUntil) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);
      setProgress(pct);

      if (!finished && pct < 92 && Math.random() < 0.03) {
        pauseUntil = now + (120 + Math.random() * 350);
      }

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        setTimeout(() => onDone?.(), 150);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <style>{`
        .splash-root {
          background: #faf9f6;
        }

        /* Soft ambient glow — warm, subtle */
        @keyframes breathe {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.75; transform: translate(-50%, -50%) scale(1.08); }
        }
        .ambient-glow {
          position: absolute;
          top: 45%;
          left: 50%;
          width: 620px;
          height: 620px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,165,92,0.12) 0%, rgba(201,165,92,0.04) 45%, transparent 70%);
          animation: breathe 5s ease-in-out infinite;
          pointer-events: none;
        }

        /* Subtle grain */
        .grain-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          pointer-events: none;
        }

        /* Floating dust */
        @keyframes dust-float {
          0%   { transform: translateY(0); opacity: 0; }
          15%  { opacity: 0.4; }
          85%  { opacity: 0.2; }
          100% { transform: translateY(-60vh); opacity: 0; }
        }
        .dust-particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(120, 100, 70, 0.35);
          animation: dust-float linear infinite;
          pointer-events: none;
        }

        /* Letter blur-rise reveal */
        @keyframes letter-rise {
          0%   { opacity: 0; transform: translateY(28px); filter: blur(14px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .brand-letter {
          display: inline-block;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          color: #23221f;
          animation: letter-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Gentle shimmer sweep — very subtle */
        @keyframes soft-shine {
          0%   { background-position: -150% center; }
          100% { background-position: 250% center; }
        }
        .brand-wrap {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(
            100deg,
            #23221f 40%,
            #b08d4f 50%,
            #23221f 60%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: soft-shine 5s ease-in-out 1.6s infinite;
        }

        /* Underline draw */
        @keyframes line-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .underline-draw {
          transform-origin: center;
          animation: line-draw 1.1s cubic-bezier(0.22, 1, 0.36, 1) 1.1s both;
          background: linear-gradient(90deg, transparent, rgba(176,141,79,0.65), transparent);
        }

        /* Fade ups */
        @keyframes fade-up-soft {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .subtitle-fade {
          animation: fade-up-soft 1s ease-out 1.4s both;
          font-family: 'Poppins', sans-serif;
        }
        .badge-fade {
          animation: fade-up-soft 1s ease-out 1.7s both;
          font-family: 'Poppins', sans-serif;
        }

        /* Progress — thin, elegant */
        .progress-track {
          background: rgba(35, 34, 31, 0.07);
          border: 1px solid rgba(35, 34, 31, 0.05);
        }
        .progress-fill {
          background: linear-gradient(90deg, rgba(176,141,79,0.5), #b08d4f);
          box-shadow: 0 0 10px rgba(176,141,79,0.2);
        }

        /* Percentage */
        @keyframes pct-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .pct-fade {
          animation: pct-fade 1s ease-out 0.6s both;
          font-family: 'Poppins', sans-serif;
        }

        /* Slow rotating thin ring behind */
        @keyframes ring-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .thin-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          border: 1px solid rgba(35, 34, 31, 0.05);
          border-top-color: rgba(176,141,79,0.25);
          animation: ring-rotate 14s linear infinite;
          pointer-events: none;
        }
        .thin-ring-2 {
          width: 540px;
          height: 540px;
          border-top-color: rgba(35, 34, 31, 0.07);
          animation: ring-rotate 22s linear infinite reverse;
        }
      `}</style>

      {/* Base */}
      <div className="splash-root absolute inset-0" />

      {/* Ambient glow */}
      <div className="ambient-glow" />

      {/* Rings */}
      <div className="thin-ring" />
      <div className="thin-ring thin-ring-2" />

      {/* Grain */}
      <div className="grain-overlay" />

      {/* Dust */}
      {dust.map((d, i) => (
        <span
          key={i}
          className="dust-particle"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-9">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <h1 className="brand-wrap flex items-center justify-center text-6xl tracking-tight sm:text-8xl md:text-8xl">
            {BRAND_LETTERS.map((ch, i) => (
              <span
                key={i}
                className="brand-letter"
                style={{ animationDelay: `${0.15 + i * 0.09}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>
          <div className="underline-draw mt-4 h-px w-40 sm:w-56" />
        </div>

        {/* Subtitle */}
        <p className="subtitle-fade text-sm font-light tracking-[0.45em] uppercase sm:text-base" style={{ color: "rgba(35,34,31,0.45)" }}>
          Jansuraj is loading in
        </p>

        {/* Bihar */}
        <div className="badge-fade">
          <span
            className="rounded-full border px-6 py-2 text-sm font-medium tracking-[0.3em] uppercase sm:text-base"
            style={{ color: "#a07f42", borderColor: "rgba(176,141,79,0.3)" }}
          >
            Bihar
          </span>
        </div>

        {/* Progress */}
        <div className="w-full max-w-xs sm:max-w-sm">
          <div className="progress-track h-1 w-full overflow-visible rounded-full">
            <div
              className="progress-fill h-full rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 120ms linear",
              }}
            />
          </div>
          <div className="pct-fade mt-6 flex items-baseline justify-center gap-1">
            <span className="text-2xl font-light tabular-nums sm:text-3xl" style={{ color: "rgba(35,34,31,0.85)" }}>
              {Math.round(progress)}
            </span>
            <span className="text-sm font-light" style={{ color: "rgba(35,34,31,0.35)" }}>
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
