import type { Coordinate } from './types';

export function squaredDistance(a: Coordinate, b: Coordinate): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return dx * dx + dy * dy;
}

export function distance(a: Coordinate, b: Coordinate): number {
  return Math.sqrt(squaredDistance(a, b));
}

export function pathLength(points: Coordinate[], closed = false): number {
  if (points.length < 2) {
    return 0;
  }

  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    total += distance(points[index - 1]!, points[index]!);
  }

  if (closed) {
    total += distance(points[points.length - 1]!, points[0]!);
  }

  return total;
}
