/**
 * Shared math utilities for exercise analyzers.
 * All functions operate on normalized MediaPipe landmarks {x, y, z, visibility}.
 */

/** Calculate the angle (degrees) at vertex B, formed by points A–B–C */
export const calcAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
};

/** Euclidean distance between two landmarks */
export const dist = (a, b) => {
  if (!a || !b) return 0;
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

/** Linear interpolation: map value from [inMin,inMax] to [outMin,outMax], clamped */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const clamped = Math.max(inMin, Math.min(inMax, value));
  return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/** Check that all landmarks exist and have sufficient visibility */
export const hasLandmarks = (landmarks, keys, minVis = 0.4) =>
  keys.every((k) => landmarks[k] && (landmarks[k].visibility ?? 1) >= minVis);

/** Average of two angles */
export const avgAngle = (a, b) => (a + b) / 2;