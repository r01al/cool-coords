import type { Coordinate3D } from './types';

/** Returns the squared Euclidean distance between two 3D cartesian coordinates. */
export function squaredDistance3D(a: Coordinate3D, b: Coordinate3D): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = a.z - b.z;

	return dx * dx + dy * dy + dz * dz;
}

/** Returns the Euclidean distance between two 3D cartesian coordinates. */
export function distance3D(a: Coordinate3D, b: Coordinate3D): number {
	return Math.sqrt(squaredDistance3D(a, b));
}

/** Builds a symmetric distance matrix for a list of 3D cartesian coordinates. */
export function createDistanceMatrix3D(points: Coordinate3D[]): number[][] {
	const matrix = Array.from({ length: points.length }, () => Array<number>(points.length).fill(0));

	for (let row = 0; row < points.length; row += 1) {
		for (let column = row + 1; column < points.length; column += 1) {
			const value = distance3D(points[row]!, points[column]!);

			matrix[row]![column] = value;
			matrix[column]![row] = value;
		}
	}

	return matrix;
}

/** Sums the segment lengths of a 3D cartesian path and optionally closes the ring. */
export function pathLength3D(points: Coordinate3D[], closed = false): number {
	if (points.length < 2) {
		return 0;
	}

	let total = 0;

	for (let index = 1; index < points.length; index += 1) {
		total += distance3D(points[index - 1]!, points[index]!);
	}

	if (closed) {
		total += distance3D(points[points.length - 1]!, points[0]!);
	}

	return total;
}
