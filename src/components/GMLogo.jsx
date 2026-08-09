import React from 'react';
import gmLogoPng from '../assets/gm-logo.png';

export default function GMLogo({ width = 80, className = '' }) {
  return (
    <img
      src={gmLogoPng}
      alt="Gosian Media"
      width={width}
      className={className}
      style={{ display: 'block', height: 'auto' }}
    />
  );
}
