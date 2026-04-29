import type { BoundingBox3D, Coordinate3D } from './types';

/** Returns the arithmetic mean of a list of 3D cartesian coordinates. */
export function centroid3D(points: Coordinate3D[]): Coordinate3D | null {
	if (points.length === 0) {
		return null;
	}

	let sumX = 0;
	let sumY = 0;
	let sumZ = 0;

	for (const point of points) {
		sumX += point.x;
		sumY += point.y;
		sumZ += point.z;
	}

	return {
		x: sumX / points.length,
		y: sumY / points.length,
		z: sumZ / points.length
	};
}

/** Computes the smallest axis-aligned 3D box that contains every point. */
export function boundingBox3D(points: Coordinate3D[]): BoundingBox3D | null {
	if (points.length === 0) {
		return null;
	}

	let minX = points[0]!.x;
	let maxX = points[0]!.x;
	let minY = points[0]!.y;
	let maxY = points[0]!.y;
	let minZ = points[0]!.z;
	let maxZ = points[0]!.z;

	for (const point of points) {
		minX = Math.min(minX, point.x);
		maxX = Math.max(maxX, point.x);
		minY = Math.min(minY, point.y);
		maxY = Math.max(maxY, point.y);
		minZ = Math.min(minZ, point.z);
		maxZ = Math.max(maxZ, point.z);
	}

	return {
		min: { x: minX, y: minY, z: minZ },
		max: { x: maxX, y: maxY, z: maxZ },
		width: maxX - minX,
		height: maxY - minY,
		depth: maxZ - minZ,
		center: {
			x: (minX + maxX) / 2,
			y: (minY + maxY) / 2,
			z: (minZ + maxZ) / 2
		}
	};
}

/** Offsets a 3D cartesian coordinate by a delta vector. */
export function translate3D(point: Coordinate3D, delta: Coordinate3D): Coordinate3D {
	return {
		x: point.x + delta.x,
		y: point.y + delta.y,
		z: point.z + delta.z
	};
}

/** Returns the midpoint between two 3D cartesian coordinates. */
export function midpoint3D(a: Coordinate3D, b: Coordinate3D): Coordinate3D {
	return {
		x: (a.x + b.x) / 2,
		y: (a.y + b.y) / 2,
		z: (a.z + b.z) / 2
	};
}
