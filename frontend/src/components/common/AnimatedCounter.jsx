import React, { useState, useEffect } from 'react';

/**
 * AnimatedCounter Component
 * Animates numbers running up smoothly from a start value to target end value
 * with custom duration, easing, decimals, prefix, and suffix.
 */
export default function AnimatedCounter({
  start = 0,
  end = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic formula for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [start, end, duration]);

  const formattedNumber = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('en-IN');

  return (
    <span className={`tabular-nums font-heading ${className}`}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
