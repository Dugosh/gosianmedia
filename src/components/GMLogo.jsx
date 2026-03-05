import React from 'react';

/**
 * Gosian Media GM logomark — SVG recreation of the geometric G + three-bar M.
 * The G is an angular C-frame with a mid-height bar; the M is three italic parallelogram bars.
 */
export default function GMLogo({ width = 80, glow = false, className = '' }) {
  const height = width * (72 / 192);
  const color = '#FF4D00';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 192 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: 'drop-shadow(0 0 10px rgba(255,77,0,0.65)) drop-shadow(0 0 22px rgba(255,77,0,0.35))' } : {}}
    >
      {/* ── G: angular C frame + mid bar ─────────────────────── */}
      {/* C frame using evenodd — outer rect minus inner cutout = C shape */}
      <path
        fill={color}
        fillRule="evenodd"
        d={[
          // Outer rectangle (G bounding box)
          'M 0 0 L 74 0 L 74 72 L 0 72 Z',
          // Inner cutout — creates the C opening (right + center)
          'M 14 14 L 74 14 L 74 58 L 14 58 Z',
        ].join(' ')}
      />
      {/* Horizontal bar — partially closes the C to form the G */}
      <rect x="38" y="28" width="36" height="16" fill={color} />

      {/* ── M: three slanted bars ─────────────────────────────── */}
      {/* Each bar is a parallelogram leaning ~20° rightward */}
      {/* Bar 1 */}
      <polygon points="86,72 100,72 120,0 106,0" fill={color} />
      {/* Bar 2 */}
      <polygon points="110,72 124,72 144,0 130,0" fill={color} />
      {/* Bar 3 */}
      <polygon points="134,72 148,72 168,0 154,0" fill={color} />
    </svg>
  );
}
