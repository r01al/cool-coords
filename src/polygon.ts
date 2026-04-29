import { EARTH_RADIUS_METERS } from './geospatial';
import type {
  Coordinate,
  GeoCoordinate,
  PolygonShape,
  WindingDirection
} from './types';

const EPSILON = 1e-12;

export function triangleSignedArea(
  a: Coordinate,
  b: Coordinate,
  c: Coordinate
): number {
  return (
    a.x * (b.y - c.y) +
    b.x * (c.y - a.y) +
    c.x * (a.y - b.y)
  ) / 2;
}

export function triangleArea(a: Coordinate, b: Coordinate, c: Coordinate): number {
  return Math.abs(triangleSignedArea(a, b, c));
}

export function polygonSignedArea(points: Coordinate[]): number {
  const ring = normalizeCoordinateRing(points);

  if (ring.length < 3) {
    return 0;
  }

  let sum = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index]!;
    const next = ring[(index + 1) % ring.length]!;
    sum += current.x * next.y - next.x * current.y;
  }

  return sum / 2;
}

export function polygonArea(points: Coordinate[]): number {
  return Math.abs(polygonSignedArea(points));
}

export function polygonWinding(points: Coordinate[]): WindingDirection {
  const signedArea = polygonSignedArea(points);

  if (signedArea > 0) {
    return 'counterclockwise';
  }

  if (signedArea < 0) {
    return 'clockwise';
  }

  return 'degenerate';
}

export function polygonAreaWithHoles(
  outerRing: Coordinate[],
  holes: Coordinate[][] = []
): number {
  return polygonArea(outerRing) - sumCartesianHoleArea(holes);
}

export function multiPolygonArea(polygons: PolygonShape<Coordinate>[]): number {
  let total = 0;

  for (const polygon of polygons) {
    total += polygonAreaWithHoles(polygon.outer, polygon.holes ?? []);
  }

  return total;
}

export function geodesicPolygonSignedArea(
  points: GeoCoordinate[],
  radius = EARTH_RADIUS_METERS
): number {
  assertValidRadius(radius);

  const ring = normalizeGeoRing(points);

  if (ring.length < 3) {
    return 0;
  }

  let sum = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index]!;
    const next = ring[(index + 1) % ring.length]!;

    assertValidGeoCoordinate(current, `points[${index}]`);

    const nextIndex = (index + 1) % ring.length;
    assertValidGeoCoordinate(next, `points[${nextIndex}]`);

    const latitude1 = toRadians(current.latitude);
    const latitude2 = toRadians(next.latitude);
    const deltaLongitude = toRadians(
      normalizeLongitudeDelta(next.longitude - current.longitude)
    );

    sum += deltaLongitude * (2 + Math.sin(latitude1) + Math.sin(latitude2));
  }

  return -(sum * radius * radius) / 2;
}

export function geodesicPolygonArea(
  points: GeoCoordinate[],
  radius = EARTH_RADIUS_METERS
): number {
  return Math.abs(geodesicPolygonSignedArea(points, radius));
}

export function geodesicPolygonAreaWithHoles(
  outerRing: GeoCoordinate[],
  holes: GeoCoordinate[][] = [],
  radius = EARTH_RADIUS_METERS
): number {
  return geodesicPolygonArea(outerRing, radius) - sumGeodesicHoleArea(holes, radius);
}

export function geodesicMultiPolygonArea(
  polygons: PolygonShape<GeoCoordinate>[],
  radius = EARTH_RADIUS_METERS
): number {
  let total = 0;

  for (const polygon of polygons) {
    total += geodesicPolygonAreaWithHoles(
      polygon.outer,
      polygon.holes ?? [],
      radius
    );
  }

  return total;
}

function normalizeCoordinateRing(points: Coordinate[]): Coordinate[] {
  if (points.length < 2) {
    return [...points];
  }

  const first = points[0]!;
  const last = points[points.length - 1]!;

  if (first.x === last.x && first.y === last.y) {
    return points.slice(0, -1);
  }

  return [...points];
}

function normalizeGeoRing(points: GeoCoordinate[]): GeoCoordinate[] {
  if (points.length < 2) {
    return [...points];
  }

  const first = points[0]!;
  const last = points[points.length - 1]!;

  if (
    first.latitude === last.latitude &&
    first.longitude === last.longitude
  ) {
    return points.slice(0, -1);
  }

  return [...points];
}

function sumCartesianHoleArea(holes: Coordinate[][]): number {
  let total = 0;

  for (const hole of holes) {
    total += polygonArea(hole);
  }

  return total;
}

function sumGeodesicHoleArea(holes: GeoCoordinate[][], radius: number): number {
  let total = 0;

  for (const hole of holes) {
    total += geodesicPolygonArea(hole, radius);
  }

  return total;
}

function assertValidGeoCoordinate(value: GeoCoordinate, label: string): void {
  assertFiniteNumber(value.latitude, `${label}.latitude`);
  assertFiniteNumber(value.longitude, `${label}.longitude`);

  if (value.latitude < -90 || value.latitude > 90) {
    throw new Error(`${label}.latitude must be between -90 and 90 degrees.`);
  }

  if (value.longitude < -180 || value.longitude > 180) {
    throw new Error(`${label}.longitude must be between -180 and 180 degrees.`);
  }
}

function assertValidRadius(radius: number): void {
  assertFiniteNumber(radius, 'radius');

  if (radius <= 0) {
    throw new Error('radius must be greater than 0.');
  }
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function normalizeLongitudeDelta(value: number): number {
  const normalized = ((value + 180) % 360 + 360) % 360 - 180;

  if (Math.abs(normalized + 180) <= EPSILON) {
    return 180;
  }

  return normalized;
}
