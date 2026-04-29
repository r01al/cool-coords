import type { Coordinate } from './types';

/** Returns the squared Euclidean distance between two planar coordinates. */
export function squaredDistance(a: Coordinate, b: Coordinate): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;

	return dx * dx + dy * dy;
}

/** Returns the Euclidean distance between two planar coordinates. */
export function distance(a: Coordinate, b: Coordinate): number {
	return Math.sqrt(squaredDistance(a, b));
}

/** Builds a symmetric planar distance matrix for a list of coordinates. */
export function createDistanceMatrix(points: Coordinate[]): number[][] {
	const matrix = Array.from({ length: points.length }, () => Array<number>(points.length).fill(0));

	for (let row = 0; row < points.length; row += 1) {
		for (let column = row + 1; column < points.length; column += 1) {
			const value = distance(points[row]!, points[column]!);

			matrix[row]![column] = value;
			matrix[column]![row] = value;
		}
	}

	return matrix;
}

/** Sums the segment lengths of a planar path and optionally closes the ring. */
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
