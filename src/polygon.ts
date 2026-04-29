import { EARTH_RADIUS_METERS } from './geospatial';
import type {
	Coordinate,
	GeoCoordinate,
	PolygonShape,
	WindingDirection
} from './types';

const EPSILON = 1e-12;

/** Returns the signed planar area of a triangle from three coordinates. */
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

/** Returns the absolute planar area of a triangle. */
export function triangleArea(a: Coordinate, b: Coordinate, c: Coordinate): number {
	return Math.abs(triangleSignedArea(a, b, c));
}

/** Returns the signed planar area of a polygon ring using the shoelace formula. */
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

/** Returns the absolute planar area enclosed by a polygon ring. */
export function polygonArea(points: Coordinate[]): number {
	return Math.abs(polygonSignedArea(points));
}

/** Returns the area-weighted centroid of a planar polygon ring. */
export function polygonCentroid(points: Coordinate[]): Coordinate | null {
	const ring = normalizeCoordinateRing(points);

	if (ring.length < 3) {
		return null;
	}

	let twiceArea = 0;
	let weightedX = 0;
	let weightedY = 0;

	for (let index = 0; index < ring.length; index += 1) {
		const current = ring[index]!;
		const next = ring[(index + 1) % ring.length]!;
		const cross = current.x * next.y - next.x * current.y;

		twiceArea += cross;
		weightedX += (current.x + next.x) * cross;
		weightedY += (current.y + next.y) * cross;
	}

	if (Math.abs(twiceArea) <= EPSILON) {
		return null;
	}

	return {
		x: weightedX / (3 * twiceArea),
		y: weightedY / (3 * twiceArea)
	};
}

/** Reports whether a polygon ring is clockwise, counterclockwise, or degenerate. */
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

/** Returns the filled planar area after subtracting all hole rings. */
export function polygonAreaWithHoles(
	outerRing: Coordinate[],
	holes: Coordinate[][] = []
): number {
	return polygonArea(outerRing) - sumCartesianHoleArea(holes);
}

/** Returns the area-weighted centroid of a planar polygon with hole rings removed. */
export function polygonCentroidWithHoles(
	outerRing: Coordinate[],
	holes: Coordinate[][] = []
): Coordinate | null {
	const outerCentroid = polygonCentroid(outerRing);
	const outerArea = polygonArea(outerRing);

	if (outerCentroid === null || outerArea <= EPSILON) {
		return null;
	}

	let totalArea = outerArea;
	let weightedX = outerCentroid.x * outerArea;
	let weightedY = outerCentroid.y * outerArea;

	for (const hole of holes) {
		const holeCentroid = polygonCentroid(hole);
		const holeArea = polygonArea(hole);

		if (holeCentroid === null || holeArea <= EPSILON) {
			continue;
		}

		totalArea -= holeArea;
		weightedX -= holeCentroid.x * holeArea;
		weightedY -= holeCentroid.y * holeArea;
	}

	if (totalArea <= EPSILON) {
		return null;
	}

	return {
		x: weightedX / totalArea,
		y: weightedY / totalArea
	};
}

/** Sums the filled planar area of multiple polygons and their holes. */
export function multiPolygonArea(polygons: PolygonShape<Coordinate>[]): number {
	let total = 0;

	for (const polygon of polygons) {
		total += polygonAreaWithHoles(polygon.outer, polygon.holes ?? []);
	}

	return total;
}

/** Returns the area-weighted centroid across multiple planar polygons. */
export function multiPolygonCentroid(
	polygons: PolygonShape<Coordinate>[]
): Coordinate | null {
	let totalArea = 0;
	let weightedX = 0;
	let weightedY = 0;

	for (const polygon of polygons) {
		const centroid = polygonCentroidWithHoles(polygon.outer, polygon.holes ?? []);
		const area = polygonAreaWithHoles(polygon.outer, polygon.holes ?? []);

		if (centroid === null || area <= EPSILON) {
			continue;
		}

		totalArea += area;
		weightedX += centroid.x * area;
		weightedY += centroid.y * area;
	}

	if (totalArea <= EPSILON) {
		return null;
	}

	return {
		x: weightedX / totalArea,
		y: weightedY / totalArea
	};
}

/** Returns the signed spherical area of a geographic polygon ring. */
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

/** Returns the absolute spherical area enclosed by a geographic polygon ring. */
export function geodesicPolygonArea(
	points: GeoCoordinate[],
	radius = EARTH_RADIUS_METERS
): number {
	return Math.abs(geodesicPolygonSignedArea(points, radius));
}

/** Returns the area-weighted centroid of a polygon drawn on a sphere. */
export function geodesicPolygonCentroid(
	points: GeoCoordinate[],
	radius = EARTH_RADIUS_METERS
): GeoCoordinate | null {
	const region = computeGeodesicRingCentroid(points, radius);

	return region === null ? null : vectorToGeo(region.meanVector);
}

/** Returns the filled spherical area after subtracting geographic hole rings. */
export function geodesicPolygonAreaWithHoles(
	outerRing: GeoCoordinate[],
	holes: GeoCoordinate[][] = [],
	radius = EARTH_RADIUS_METERS
): number {
	return geodesicPolygonArea(outerRing, radius) - sumGeodesicHoleArea(holes, radius);
}

/** Returns the area-weighted centroid of a spherical polygon with holes removed. */
export function geodesicPolygonCentroidWithHoles(
	outerRing: GeoCoordinate[],
	holes: GeoCoordinate[][] = [],
	radius = EARTH_RADIUS_METERS
): GeoCoordinate | null {
	const region = computeGeodesicPolygonRegion(outerRing, holes, radius);

	return region === null ? null : vectorToGeo(region.meanVector);
}

/** Sums the filled spherical area of multiple geographic polygons. */
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

/** Returns the area-weighted centroid across multiple spherical polygons. */
export function geodesicMultiPolygonCentroid(
	polygons: PolygonShape<GeoCoordinate>[],
	radius = EARTH_RADIUS_METERS
): GeoCoordinate | null {
	assertValidRadius(radius);

	let totalArea = 0;
	let totalVector = zeroVector();

	for (const polygon of polygons) {
		const region = computeGeodesicPolygonRegion(
			polygon.outer,
			polygon.holes ?? [],
			radius
		);

		if (region === null || region.area <= EPSILON) {
			continue;
		}

		totalArea += region.area;
		totalVector = addVectors(totalVector, scaleVector(region.meanVector, region.area));
	}

	if (totalArea <= EPSILON) {
		return null;
	}

	return vectorToGeo(scaleVector(totalVector, 1 / totalArea));
}

/** Removes a duplicate closing point from a planar ring when present. */
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

/** Removes a duplicate closing point from a geographic ring when present. */
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

/** Sums the absolute area contribution of planar hole rings. */
function sumCartesianHoleArea(holes: Coordinate[][]): number {
	let total = 0;

	for (const hole of holes) {
		total += polygonArea(hole);
	}

	return total;
}

/** Sums the absolute area contribution of geographic hole rings. */
function sumGeodesicHoleArea(holes: GeoCoordinate[][], radius: number): number {
	let total = 0;

	for (const hole of holes) {
		total += geodesicPolygonArea(hole, radius);
	}

	return total;
}

/** Computes the centroid vector and area contribution for a single spherical ring. */
function computeGeodesicRingCentroid(
	points: GeoCoordinate[],
	radius: number
): { area: number; meanVector: Vector3 } | null {
	assertValidRadius(radius);

	const ring = normalizeGeoRing(points);

	if (ring.length < 3) {
		return null;
	}

	for (let index = 0; index < ring.length; index += 1) {
		assertValidGeoCoordinate(ring[index]!, `points[${index}]`);
	}

	if (ring.length === 3) {
		const meanVector = sphericalTriangleCentroid(ring[0]!, ring[1]!, ring[2]!);
		const area = Math.abs(geodesicPolygonSignedArea(ring, radius));

		if (meanVector === null || area <= EPSILON) {
			return null;
		}

		return {
			area,
			meanVector
		};
	}

	const referencePoint = chooseGeodesicReferencePoint(ring);
	let signedArea = 0;
	let weightedVector = zeroVector();

	for (let index = 0; index < ring.length; index += 1) {
		const current = ring[index]!;
		const next = ring[(index + 1) % ring.length]!;
		const triangleArea = geodesicPolygonSignedArea(
			[
				current,
				next,
				referencePoint
			],
			radius
		);

		if (Math.abs(triangleArea) <= EPSILON) {
			continue;
		}

		const triangleCentroid = sphericalTriangleCentroid(current, next, referencePoint);

		if (triangleCentroid === null) {
			continue;
		}

		signedArea += triangleArea;
		weightedVector = addVectors(
			weightedVector,
			scaleVector(triangleCentroid, triangleArea)
		);
	}

	if (Math.abs(signedArea) <= EPSILON) {
		return null;
	}

	return {
		area: Math.abs(signedArea),
		meanVector: scaleVector(weightedVector, 1 / signedArea)
	};
}

/** Combines an outer spherical ring and its holes into one centroid region. */
function computeGeodesicPolygonRegion(
	outerRing: GeoCoordinate[],
	holes: GeoCoordinate[][],
	radius: number
): { area: number; meanVector: Vector3 } | null {
	assertValidRadius(radius);

	const outer = computeGeodesicRingCentroid(outerRing, radius);

	if (outer === null || outer.area <= EPSILON) {
		return null;
	}

	let totalArea = outer.area;
	let totalVector = scaleVector(outer.meanVector, outer.area);

	for (const hole of holes) {
		const holeRegion = computeGeodesicRingCentroid(hole, radius);

		if (holeRegion === null || holeRegion.area <= EPSILON) {
			continue;
		}

		totalArea -= holeRegion.area;
		totalVector = subtractVectors(totalVector, scaleVector(holeRegion.meanVector, holeRegion.area));
	}

	if (totalArea <= EPSILON) {
		return null;
	}

	return {
		area: totalArea,
		meanVector: scaleVector(totalVector, 1 / totalArea)
	};
}

/** Picks a stable interior-ish reference direction for spherical triangulation. */
function chooseGeodesicReferencePoint(points: GeoCoordinate[]): GeoCoordinate {
	const pointVectors = points.map((point) => toUnitVector(point));
	const average = pointVectors.reduce(addVectors, zeroVector());
	const averageLength = vectorLength(average);

	if (averageLength > EPSILON) {
		return vectorToGeo(average)!;
	}

	for (let index = 0; index < pointVectors.length; index += 1) {
		const current = pointVectors[index]!;
		const next = pointVectors[(index + 1) % pointVectors.length]!;
		const midpointVector = addVectors(current, next);

		if (vectorLength(midpointVector) > EPSILON) {
			return vectorToGeo(midpointVector)!;
		}
	}

	return points[0]!;
}

/** Approximates a spherical triangle centroid from the mean of its unit vectors. */
function sphericalTriangleCentroid(
	a: GeoCoordinate,
	b: GeoCoordinate,
	c: GeoCoordinate
): Vector3 | null {
	const centroid = addVectors(
		addVectors(toUnitVector(a), toUnitVector(b)),
		toUnitVector(c)
	);

	return normalizeVector(centroid);
}

/** Converts a geographic coordinate into a unit Cartesian vector. */
function toUnitVector(point: GeoCoordinate): Vector3 {
	const latitude = toRadians(point.latitude);
	const longitude = toRadians(point.longitude);
	const cosineLatitude = Math.cos(latitude);

	return {
		x: cosineLatitude * Math.cos(longitude),
		y: cosineLatitude * Math.sin(longitude),
		z: Math.sin(latitude)
	};
}

/** Converts a Cartesian direction vector back into latitude and longitude. */
function vectorToGeo(vector: Vector3): GeoCoordinate | null {
	const normalized = normalizeVector(vector);

	if (normalized === null) {
		return null;
	}

	return {
		latitude: toDegrees(Math.asin(normalized.z)),
		longitude: toDegrees(Math.atan2(normalized.y, normalized.x))
	};
}

/** Normalizes a Cartesian vector to unit length when possible. */
function normalizeVector(vector: Vector3): Vector3 | null {
	const length = vectorLength(vector);

	if (length <= EPSILON) {
		return null;
	}

	return scaleVector(vector, 1 / length);
}

/** Returns the Euclidean length of a 3D vector. */
function vectorLength(vector: Vector3): number {
	return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
}

/** Creates a zero-length 3D vector for accumulators. */
function zeroVector(): Vector3 {
	return { x: 0, y: 0, z: 0 };
}

/** Adds two 3D vectors component by component. */
function addVectors(a: Vector3, b: Vector3): Vector3 {
	return {
		x: a.x + b.x,
		y: a.y + b.y,
		z: a.z + b.z
	};
}

/** Subtracts one 3D vector from another component by component. */
function subtractVectors(a: Vector3, b: Vector3): Vector3 {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	};
}

/** Multiplies a 3D vector by a scalar value. */
function scaleVector(vector: Vector3, scalar: number): Vector3 {
	return {
		x: vector.x * scalar,
		y: vector.y * scalar,
		z: vector.z * scalar
	};
}

/** Validates that a geographic coordinate stays within spherical bounds. */
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

/** Validates that a spherical radius is finite and positive. */
function assertValidRadius(radius: number): void {
	assertFiniteNumber(radius, 'radius');

	if (radius <= 0) {
		throw new Error('radius must be greater than 0.');
	}
}

/** Validates that a numeric polygon input is finite. */
function assertFiniteNumber(value: number, label: string): void {
	if (!Number.isFinite(value)) {
		throw new Error(`${label} must be a finite number.`);
	}
}

/** Converts degrees to radians for spherical polygon calculations. */
function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}

/** Converts radians back to degrees for geographic polygon results. */
function toDegrees(value: number): number {
	return (value * 180) / Math.PI;
}

/** Wraps a longitude delta into the shortest spherical turn. */
function normalizeLongitudeDelta(value: number): number {
	const normalized = ((value + 180) % 360 + 360) % 360 - 180;

	if (Math.abs(normalized + 180) <= EPSILON) {
		return 180;
	}

	return normalized;
}

interface Vector3 {
	x: number;
	y: number;
	z: number;
}
