import type { GeoCoordinate } from './types';

export const EARTH_RADIUS_METERS = 6_371_008.8;

export function haversineDistance(
  a: GeoCoordinate,
  b: GeoCoordinate,
  radius = EARTH_RADIUS_METERS
): number {
  assertValidRadius(radius);
  assertValidGeoCoordinate(a, 'a');
  assertValidGeoCoordinate(b, 'b');

  const latitude1 = toRadians(a.latitude);
  const latitude2 = toRadians(b.latitude);
  const deltaLatitude = toRadians(b.latitude - a.latitude);
  const deltaLongitude = toRadians(b.longitude - a.longitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) ** 2;

  const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return radius * angularDistance;
}

export function geodesicPathLength(
  points: GeoCoordinate[],
  closed = false,
  radius = EARTH_RADIUS_METERS
): number {
  assertValidRadius(radius);

  if (points.length < 2) {
    return 0;
  }

  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    total += haversineDistance(points[index - 1]!, points[index]!, radius);
  }

  if (closed) {
    total += haversineDistance(points[points.length - 1]!, points[0]!, radius);
  }

  return total;
}

export function initialBearing(a: GeoCoordinate, b: GeoCoordinate): number {
  assertValidGeoCoordinate(a, 'a');
  assertValidGeoCoordinate(b, 'b');

  const latitude1 = toRadians(a.latitude);
  const latitude2 = toRadians(b.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);

  const y = Math.sin(longitudeDelta) * Math.cos(latitude2);
  const x =
    Math.cos(latitude1) * Math.sin(latitude2) -
    Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDelta);

  return normalizeBearing(toDegrees(Math.atan2(y, x)));
}

export function destinationPoint(
  start: GeoCoordinate,
  distance: number,
  bearing: number,
  radius = EARTH_RADIUS_METERS
): GeoCoordinate {
  assertValidGeoCoordinate(start, 'start');
  assertFiniteNumber(distance, 'distance');
  assertFiniteNumber(bearing, 'bearing');
  assertValidRadius(radius);

  const angularDistance = distance / radius;
  const bearingRadians = toRadians(bearing);
  const latitude1 = toRadians(start.latitude);
  const longitude1 = toRadians(start.longitude);

  const latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(angularDistance) +
      Math.cos(latitude1) * Math.sin(angularDistance) * Math.cos(bearingRadians)
  );

  const longitude2 =
    longitude1 +
    Math.atan2(
      Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(latitude1),
      Math.cos(angularDistance) - Math.sin(latitude1) * Math.sin(latitude2)
    );

  return {
    latitude: toDegrees(latitude2),
    longitude: normalizeLongitude(toDegrees(longitude2))
  };
}

export function greatCircleMidpoint(a: GeoCoordinate, b: GeoCoordinate): GeoCoordinate {
  assertValidGeoCoordinate(a, 'a');
  assertValidGeoCoordinate(b, 'b');

  const latitude1 = toRadians(a.latitude);
  const longitude1 = toRadians(a.longitude);
  const latitude2 = toRadians(b.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);

  const bx = Math.cos(latitude2) * Math.cos(longitudeDelta);
  const by = Math.cos(latitude2) * Math.sin(longitudeDelta);

  const latitude3 = Math.atan2(
    Math.sin(latitude1) + Math.sin(latitude2),
    Math.sqrt((Math.cos(latitude1) + bx) ** 2 + by ** 2)
  );

  const longitude3 = longitude1 + Math.atan2(by, Math.cos(latitude1) + bx);

  return {
    latitude: toDegrees(latitude3),
    longitude: normalizeLongitude(toDegrees(longitude3))
  };
}

export function normalizeLongitude(longitude: number): number {
  assertFiniteNumber(longitude, 'longitude');

  const normalized = ((longitude + 180) % 360 + 360) % 360 - 180;

  return normalized === -180 ? 180 : normalized;
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

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function normalizeBearing(value: number): number {
  return ((value % 360) + 360) % 360;
}
