import { describe, expect, it } from 'vitest';

import { createDistanceMatrix, distance, pathLength, squaredDistance } from '../src/index';

describe('flat distance helpers', () => {
	it('calculates squared and Euclidean distance', () => {
		const a = { x: 0, y: 0 };
		const b = { x: 3, y: 4 };

		expect(squaredDistance(a, b)).toBe(25);
		expect(distance(a, b)).toBe(5);
	});

	it('builds a symmetric distance matrix', () => {
		expect(
			createDistanceMatrix([
				{ x: 0, y: 0 },
				{ x: 3, y: 4 },
				{ x: 6, y: 4 }
			])
		).toEqual([
			[0, 5, Math.sqrt(52)],
			[5, 0, 3],
			[Math.sqrt(52), 3, 0]
		]);
	});

	it('returns empty and singleton matrices without extra work', () => {
		expect(createDistanceMatrix([])).toEqual([]);
		expect(createDistanceMatrix([{ x: 2, y: -1 }])).toEqual([[0]]);
	});

	it('calculates open and closed path length', () => {
		const points = [
			{ x: 0, y: 0 },
			{ x: 3, y: 4 },
			{ x: 6, y: 4 }
		];

		expect(pathLength(points)).toBe(8);
		expect(pathLength(points, true)).toBe(8 + Math.sqrt(52));
	});
});
