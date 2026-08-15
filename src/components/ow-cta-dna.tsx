type Point = { x: number; y: number };

const WIDTH = 720;
const HEIGHT = 520;
const CX = WIDTH * 0.54;
const AMPLITUDE = 78;
const CYCLES = 2.15;
const RUNG_COUNT = 16;
const SEGMENTS = 140;

function helixPoint(t: number, phase: number): Point {
  return {
    x: CX + AMPLITUDE * Math.sin(t * Math.PI * 2 * CYCLES + phase),
    y: 36 + t * (HEIGHT - 72),
  };
}

function strandPath(phase: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const { x, y } = helixPoint(t, phase);
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join(" ");
}

function rungPath(t: number): string {
  const a = helixPoint(t, 0);
  const b = helixPoint(t, Math.PI);
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

export function CtaDnaIllustration() {
  const rungs = Array.from({ length: RUNG_COUNT }, (_, i) => i / (RUNG_COUNT - 1));

  return (
    <svg
      className="ow-cta-dna-svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="ow-dna-strand-front" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffdfb" />
          <stop offset="42%" stopColor="#8C2860" />
          <stop offset="100%" stopColor="#8C2860" />
        </linearGradient>
        <linearGradient id="ow-dna-strand-back" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8C2860" />
          <stop offset="55%" stopColor="#8C2860" />
          <stop offset="100%" stopColor="#6E1C4A" />
        </linearGradient>
        <linearGradient id="ow-dna-rung" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8C2860" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#8C2860" />
        </linearGradient>
        <filter id="ow-dna-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#5a1438" floodOpacity="0.28" />
        </filter>
        <filter id="ow-dna-soft" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <g filter="url(#ow-dna-shadow)" opacity="0.92">
        {rungs.map((t) => (
          <path
            key={`rung-back-${t}`}
            d={rungPath(t)}
            stroke="url(#ow-dna-rung)"
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.72}
          />
        ))}

        <path
          d={strandPath(Math.PI)}
          stroke="url(#ow-dna-strand-back)"
          strokeWidth={30}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.82}
        />

        {rungs.map((t) => (
          <path
            key={`rung-front-${t}`}
            d={rungPath(t)}
            stroke="url(#ow-dna-rung)"
            strokeWidth={16}
            strokeLinecap="round"
          />
        ))}

        <path
          d={strandPath(0)}
          stroke="url(#ow-dna-strand-front)"
          strokeWidth={32}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={strandPath(0)}
          stroke="rgba(255,255,255,0.42)"
          strokeWidth={10}
          strokeLinecap="round"
          transform="translate(-6,-4)"
          filter="url(#ow-dna-soft)"
          opacity={0.55}
        />
      </g>
    </svg>
  );
}
