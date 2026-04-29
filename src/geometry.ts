import { distance, squaredDistance } from './metrics';
import type { BoundingBox, Circle, Coordinate } from './types';

const EPSILON = 1e-9;

export function centroid(points: Coordinate[]): Coordinate | null {
  if (points.length === 0) {
    return null;
  }

  let sumX = 0;
  let sumY = 0;

  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }

  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
}

export function boundingBox(points: Coordinate[]): BoundingBox | null {
  if (points.length === 0) {
    return null;
  }

  let minX = points[0]!.x;
  let maxX = points[0]!.x;
  let minY = points[0]!.y;
  let maxY = points[0]!.y;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY },
    width: maxX - minX,
    height: maxY - minY,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2
    }
  };
}

export function translate(point: Coordinate, delta: Coordinate): Coordinate {
  return {
    x: point.x + delta.x,
    y: point.y + delta.y
  };
}

export function midpoint(a: Coordinate, b: Coordinate): Coordinate {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2
  };
}

export function isPointInCircle(point: Coordinate, circle: Circle): boolean {
  return squaredDistance(point, circle.center) <= (circle.radius + EPSILON) ** 2;
}

export function circleFromTwoPoints(a: Coordinate, b: Coordinate): Circle {
  const center = midpoint(a, b);

  return {
    center,
    radius: distance(center, a)
  };
}

export function circleFromThreePoints(
  a: Coordinate,
  b: Coordinate,
  c: Coordinate
): Circle | null {
  const determinant =
    2 *
    (a.x * (b.y - c.y) +
      b.x * (c.y - a.y) +
      c.x * (a.y - b.y));

  if (Math.abs(determinant) <= EPSILON) {
    return null;
  }

  const aSquared = a.x * a.x + a.y * a.y;
  const bSquared = b.x * b.x + b.y * b.y;
  const cSquared = c.x * c.x + c.y * c.y;

  const center = {
    x:
      (aSquared * (b.y - c.y) +
        bSquared * (c.y - a.y) +
        cSquared * (a.y - b.y)) /
      determinant,
    y:
      (aSquared * (c.x - b.x) +
        bSquared * (a.x - c.x) +
        cSquared * (b.x - a.x)) /
      determinant
  };

  return {
    center,
    radius: distance(center, a)
  };
}

export function minimumEnclosingCircle(points: Coordinate[]): Circle | null {
  if (points.length === 0) {
    return null;
  }

  let circle: Circle | null = null;

  for (const point of points) {
    const candidate = {
      center: { x: point.x, y: point.y },
      radius: 0
    };

    if (containsAllPoints(points, candidate) && isBetterCircle(candidate, circle)) {
      circle = candidate;
    }
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const candidate = circleFromTwoPoints(points[i]!, points[j]!);

      if (containsAllPoints(points, candidate) && isBetterCircle(candidate, circle)) {
        circle = candidate;
      }
    }
  }

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      for (let k = j + 1; k < points.length; k += 1) {
        const candidate =
          circleFromThreePoints(points[i]!, points[j]!, points[k]!) ??
          circleFromFarthestPair(points[i]!, points[j]!, points[k]!);

        if (containsAllPoints(points, candidate) && isBetterCircle(candidate, circle)) {
          circle = candidate;
        }
      }
    }
  }

  return circle;
}

function circleFromFarthestPair(
  a: Coordinate,
  b: Coordinate,
  c: Coordinate
): Circle {
  const candidates = [
    circleFromTwoPoints(a, b),
    circleFromTwoPoints(a, c),
    circleFromTwoPoints(b, c)
  ];

  let best = candidates[0]!;

  for (const candidate of candidates) {
    if (
      isPointInCircle(a, candidate) &&
      isPointInCircle(b, candidate) &&
      isPointInCircle(c, candidate) &&
      candidate.radius < best.radius
    ) {
      best = candidate;
    }
  }

  return best;
}

function containsAllPoints(points: Coordinate[], circle: Circle): boolean {
  for (const point of points) {
    if (!isPointInCircle(point, circle)) {
      return false;
    }
  }

  return true;
}

function isBetterCircle(candidate: Circle, current: Circle | null): boolean {
  return current === null || candidate.radius < current.radius;
}
