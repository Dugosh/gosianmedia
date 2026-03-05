import React from 'react';

/**
 * Gosian Media — GM logomark SVG recreation.
 *
 * The G has a distinctive chevron/arrow top (two angular peaks with a V-notch)
 * rather than flat horizontal edges. The inner hollow is an angled parallelogram
 * that opens to the right, forming the G's opening + crossbar.
 *
 * The M is three diagonal parallelogram bars at ~65° lean.
 *
 * Color: Gosian Orange #F25623
 */
export default function GMLogo({ width = 80, className = '' }) {
  const height = width * (120 / 298);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 298 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* ── G: compound path with evenodd inner cutout ────────────
          Outer: chevron top (two peaks + notch) → right wall → rounded bottom
          Inner: angled parallelogram hollow that opens to the right (the G's gap) */}
      <path
        fill="#F25623"
        fillRule="evenodd"
        d={[
          // Outer contour (clockwise)
          'M 0,38',           // left side start (chevron base)
          'L 46,0',           // left diagonal up to left peak
          'L 56,14',          // down to V-notch center
          'L 64,0',           // up to right peak
          'L 120,38',         // right diagonal down to chevron base
          'L 120,110',        // straight down the right side
          'Q 120,120 110,120',// rounded bottom-right corner
          'L 12,120',         // across the bottom edge
          'Q 0,120 0,110',    // rounded bottom-left corner
          'Z',                // close back to (0,38)

          // Inner cutout (clockwise → hole with evenodd)
          // Angled parallelogram: top follows chevron slope, opens to right
          'M 30,56',          // inner top-left (rounded start)
          'L 120,48',         // angled inner ceiling → right edge
          'L 120,66',         // down through the G opening
          'L 46,66',          // left across crossbar top to inner edge
          'Q 30,66 30,56',    // rounded inner BL corner
          'Z',
        ].join(' ')}
      />

      {/* ── M: three diagonal bars ──────────────────────────────
          Parallelograms leaning ~65° from horizontal.
          Width=28, lean=50 over 120px height, gap=12 between bars. */}
      <polygon fill="#F25623" points="136,120 164,120 214,0 186,0"/>
      <polygon fill="#F25623" points="176,120 204,120 254,0 226,0"/>
      <polygon fill="#F25623" points="216,120 244,120 294,0 266,0"/>
    </svg>
  );
}
