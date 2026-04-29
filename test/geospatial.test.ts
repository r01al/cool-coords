import { describe, expect, it } from 'vitest';

import {
	createGeodesicDistanceMatrix,
	EARTH_RADIUS_METERS,
	geodesicPathLength,
	haversineDistance
} from '../src/index';

describe('geodesic distance helpers', () => {
	it('calculates great-circle distance', () => {
		const a = { latitude: 0, longitude: 0 };
		const b = { latitude: 0, longitude: 1 };

		expect(haversineDistance(a, b)).toBeCloseTo((EARTH_RADIUS_METERS * Math.PI) / 180, 6);
	});

	it('builds a symmetric geodesic distance matrix', () => {
		const matrix = createGeodesicDistanceMatrix(
			[
				{ latitude: 0, longitude: 0 },
				{ latitude: 0, longitude: 90 },
				{ latitude: 90, longitude: 0 }
			],
			1
		);

		expect(matrix).toHaveLength(3);
		expect(matrix[0]).toEqual([0, Math.PI / 2, Math.PI / 2]);
		expect(matrix[1]).toEqual([Math.PI / 2, 0, Math.PI / 2]);
		expect(matrix[2]).toEqual([Math.PI / 2, Math.PI / 2, 0]);
	});

	it('returns empty and singleton matrices without extra work', () => {
		expect(createGeodesicDistanceMatrix([])).toEqual([]);
		expect(createGeodesicDistanceMatrix([{ latitude: 32.0853, longitude: 34.7818 }])).toEqual([
			[0]
		]);
	});

	it('calculates open and closed geodesic path length', () => {
		const points = [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 1 },
			{ latitude: 1, longitude: 1 }
		];

		const segment = (EARTH_RADIUS_METERS * Math.PI) / 180;

		expect(geodesicPathLength(points)).toBeCloseTo(segment * 2, 6);
		expect(geodesicPathLength(points, true)).toBeCloseTo(
			segment * 2 + haversineDistance(points[2]!, points[0]!),
			6
		);
	});
});
