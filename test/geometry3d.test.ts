import { describe, expect, it } from 'vitest';

import {
	boundingBox3D,
	centroid3D,
	createDistanceMatrix3D,
	distance3D,
	midpoint3D,
	pathLength3D,
	squaredDistance3D,
	translate3D
} from '../src/index';

describe('3d cartesian helpers', () => {
	it('calculates squared and Euclidean distance in 3d', () => {
		const a = { x: 0, y: 0, z: 0 };
		const b = { x: 2, y: 3, z: 6 };

		expect(squaredDistance3D(a, b)).toBe(49);
		expect(distance3D(a, b)).toBe(7);
	});

	it('builds a symmetric 3d distance matrix', () => {
		expect(
			createDistanceMatrix3D([
				{ x: 0, y: 0, z: 0 },
				{ x: 0, y: 3, z: 4 },
				{ x: 12, y: 3, z: 4 }
			])
		).toEqual([
			[0, 5, 13],
			[5, 0, 12],
			[13, 12, 0]
		]);
	});

	it('calculates open and closed 3d path length', () => {
		const points = [
			{ x: 0, y: 0, z: 0 },
			{ x: 0, y: 3, z: 4 },
			{ x: 12, y: 3, z: 4 }
		];

		expect(pathLength3D(points)).toBe(17);
		expect(pathLength3D(points, true)).toBe(30);
	});

	it('calculates 3d centroid, bounding box, translation, and midpoint', () => {
		expect(
			centroid3D([
				{ x: 0, y: 0, z: 0 },
				{ x: 4, y: 2, z: 6 }
			])
		).toEqual({ x: 2, y: 1, z: 3 });
		expect(centroid3D([])).toBeNull();

		expect(
			boundingBox3D([
				{ x: -1, y: 3, z: 2 },
				{ x: 4, y: 10, z: 8 }
			])
		).toEqual({
			min: { x: -1, y: 3, z: 2 },
			max: { x: 4, y: 10, z: 8 },
			width: 5,
			height: 7,
			depth: 6,
			center: { x: 1.5, y: 6.5, z: 5 }
		});
		expect(boundingBox3D([])).toBeNull();

		expect(
			translate3D(
				{ x: 5, y: 10, z: -2 },
				{ x: -2, y: 3, z: 4 }
			)
		).toEqual({ x: 3, y: 13, z: 2 });

		expect(
			midpoint3D(
				{ x: 0, y: 0, z: 0 },
				{ x: 10, y: 6, z: 2 }
			)
		).toEqual({ x: 5, y: 3, z: 1 });
	});
});
