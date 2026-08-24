import type { CSSProperties } from "react";

// Ambient decorative background from design/app-bg.html — the frosted-mint
// petal / gem / sparkle motif, toned down (teal gems only, fewer elements,
// lower opacity) so it reads as quiet texture and the content still leads.
// Fixed behind content; theme-reactive via CSS vars (see globals.css); motion
// is disabled under prefers-reduced-motion. Decorative → aria-hidden.

const PETAL_ROTATIONS = [45, 135, 225, 315];

// Large, soft, faint petal clusters in the corners (v2 "open spacing").
const leaves: { left: string; top: string; scale: number; rot: number; opacity: number; blur: number; anim: string }[] = [
  { left: "-8%", top: "6%", scale: 1.6, rot: 10, opacity: 0.5, blur: 0.8, anim: "driftA 30s ease-in-out -1s infinite" },
  { left: "108%", top: "68%", scale: 1.7, rot: -12, opacity: 0.45, blur: 0.9, anim: "driftB 34s ease-in-out -5s infinite" },
  { left: "94%", top: "-4%", scale: 1.1, rot: -20, opacity: 0.32, blur: 1.0, anim: "driftA 32s ease-in-out -3s infinite" },
];

// Teal gems only (emerald is the single accent) — a sparse scatter.
const gems: { left: string; top: string; size: number; anim: string }[] = [
  { left: "20%", top: "16%", size: 20, anim: "tw 6s ease-in-out -1s infinite" },
  { left: "82%", top: "24%", size: 16, anim: "tw 5.5s ease-in-out -2.5s infinite" },
  { left: "26%", top: "72%", size: 22, anim: "tw 5.5s ease-in-out -3s infinite" },
  { left: "78%", top: "80%", size: 14, anim: "tw 5s ease-in-out -4s infinite" },
];

const sparkles: { left: string; top: string; size: number; anim: string }[] = [
  { left: "48%", top: "12%", size: 10, anim: "spk 6s ease-in-out -1s infinite" },
  { left: "62%", top: "40%", size: 8, anim: "spk 5.5s ease-in-out -2.5s infinite" },
  { left: "34%", top: "48%", size: 7, anim: "spk 6s ease-in-out -1.8s infinite" },
  { left: "70%", top: "64%", size: 9, anim: "spk 5.5s ease-in-out -3.5s infinite" },
  { left: "40%", top: "86%", size: 8, anim: "spk 6s ease-in-out -0.6s infinite" },
];

export function AppBackground() {
  return (
    <div
      aria-hidden
      className="app-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--app-bg)", opacity: 0.9 }}
    >
      {leaves.map((leaf, i) => (
        <div
          key={`l${i}`}
          style={{
            position: "absolute",
            width: 170,
            height: 170,
            left: leaf.left,
            top: leaf.top,
            transform: `translate(-50%,-50%) rotate(${leaf.rot}deg) scale(${leaf.scale})`,
            opacity: leaf.opacity,
            filter: `blur(${leaf.blur}px)`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, animation: leaf.anim }}>
            {PETAL_ROTATIONS.map((deg) => (
              <div key={deg} style={petalStyle(deg)}>
                <div style={petalVeinStyle} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {gems.map((gem, i) => (
        <div key={`g${i}`} style={markerStyle(gem.left, gem.top, gem.size)}>
          <div style={{ position: "absolute", inset: 0, animation: gem.anim }}>
            <div style={gemFacetStyle}>
              <div style={gemGlintStyle} />
            </div>
          </div>
        </div>
      ))}

      {sparkles.map((s, i) => (
        <div key={`s${i}`} style={markerStyle(s.left, s.top, s.size)}>
          <div style={{ position: "absolute", inset: 0, animation: s.anim }}>
            <div style={sparkleVStyle} />
            <div style={sparkleHStyle} />
            <div style={sparkleCoreStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}

function petalStyle(deg: number): CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    bottom: "50%",
    width: 46,
    height: 96,
    marginLeft: -23,
    borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    background: "var(--petal-grad)",
    transformOrigin: "50% 100%",
    transform: `rotate(${deg}deg)`,
    boxShadow: "inset 0 0 12px rgba(255,255,255,.28)",
  };
}

const petalVeinStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "9%",
  width: 2,
  height: "78%",
  marginLeft: -1,
  background: "var(--petal-vein)",
  borderRadius: 2,
};

function markerStyle(left: string, top: string, size: number): CSSProperties {
  return {
    position: "absolute",
    left,
    top,
    width: size,
    height: size,
    transform: "translate(-50%,-50%)",
  };
}

const gemFacetStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 3,
  transform: "rotate(45deg)",
  background: "var(--gem-grad)",
  boxShadow: "var(--gem-shadow), inset 0 0 6px rgba(255,255,255,.7)",
};

const gemGlintStyle: CSSProperties = {
  position: "absolute",
  left: "20%",
  top: "18%",
  width: "28%",
  height: "28%",
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(255,255,255,.95), transparent 70%)",
};

const sparkleVStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: 0,
  width: 2,
  height: "100%",
  marginLeft: -1,
  background: "linear-gradient(transparent, var(--sparkle) 50%, transparent)",
  borderRadius: 2,
};

const sparkleHStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 0,
  height: 2,
  width: "100%",
  marginTop: -1,
  background: "linear-gradient(90deg, transparent, var(--sparkle) 50%, transparent)",
  borderRadius: 2,
};

const sparkleCoreStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 4,
  height: 4,
  margin: "-2px 0 0 -2px",
  borderRadius: "50%",
  background: "var(--sparkle-core)",
  boxShadow: "0 0 6px 2px var(--sparkle-core-glow)",
};
