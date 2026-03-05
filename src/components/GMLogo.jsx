import React from 'react';

/**
 * Gosian Media — accurate GM logomark recreation.
 * G: Bold C-frame with thick arms + horizontal crossbar shelf.
 * M: Three diagonal parallelogram stripes (forward-slash orientation).
 * Color: Gosian Orange #F25623
 */
export default function GMLogo({ width = 80, className = '' }) {
  const height = width * (100 / 262);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 262 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="#F25623">
        {/* ── G shape ───────────────────────────────────────
            Built from overlapping filled rects — same color merges seamlessly.
            Left wall + top arm + bottom arm = the C-frame.
            Crossbar shelf fills the lower portion of the right opening. */}

        {/* Left spine */}
        <rect x="0" y="0" width="26" height="100" rx="13" ry="13"/>
        {/* Top arm */}
        <rect x="0" y="0" width="100" height="26" rx="13" ry="13"/>
        {/* Bottom arm */}
        <rect x="0" y="74" width="100" height="26" rx="13" ry="13"/>
        {/* Crossbar / shelf (lower half of the opening, extends inward from right) */}
        <rect x="54" y="56" width="46" height="18" rx="0" ry="0"/>

        {/* ── M shape: three diagonal bars ───────────────────
            Each bar is a parallelogram leaning ~65° from horizontal.
            Lean = 46px over 100px height. Bar width = 22px, gap = 14px.
            Points: (x,100) (x+22,100) (x+68,0) (x+46,0) */}

        {/* Bar 1 */}
        <polygon points="118,100 140,100 186,0 164,0"/>
        {/* Bar 2 */}
        <polygon points="154,100 176,100 222,0 200,0"/>
        {/* Bar 3 */}
        <polygon points="190,100 212,100 258,0 236,0"/>
      </g>
    </svg>
  );
}
