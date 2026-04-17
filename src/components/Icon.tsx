export default function Icon({ size = 32 }: { size?: number }) {
  const showWaves = size >= 24;
  const radius = size >= 128 ? 28 : size >= 64 ? 16 : size >= 32 ? 8 : 3;
  const fontSize = Math.round(size * 0.56);
  const strokeWidth = size >= 128 ? 1.8 : size >= 64 ? 1.2 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} rx={radius} fill="#f97316" />

      {showWaves && (
        <>
          <path
            d={wave(size, -0.125)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <path
            d={wave(size, 0)}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <path
            d={wave(size, 0.125)}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
        </>
      )}

      <text
        x="50%"
        y="54%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontFamily="'Instrument Serif', serif"
        fontSize={fontSize}
        fontWeight={400}
      >
        T
      </text>
    </svg>
  );
}

/** Generate a sine-wave path across the full width at a vertical offset from center. */
function wave(size: number, offsetRatio: number): string {
  const cy = size * (0.5 + offsetRatio);
  const amp = size * 0.08;
  const q = size / 4;
  return `M0 ${cy} Q${q * 0.5} ${cy - amp}, ${q} ${cy} Q${q * 1.5} ${cy + amp}, ${q * 2} ${cy} Q${q * 2.5} ${cy - amp}, ${q * 3} ${cy} Q${q * 3.5} ${cy + amp}, ${q * 4} ${cy}`;
}
