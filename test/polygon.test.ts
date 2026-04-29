import { describe, expect, it } from 'vitest';

import {
	EARTH_RADIUS_METERS,
	geodesicMultiPolygonArea,
	geodesicMultiPolygonCentroid,
	geodesicPolygonArea,
	geodesicPolygonAreaWithHoles,
	geodesicPolygonCentroid,
	geodesicPolygonCentroidWithHoles,
	geodesicPolygonSignedArea,
	multiPolygonArea,
	multiPolygonCentroid,
	polygonArea,
	polygonAreaWithHoles,
	polygonCentroid,
	polygonCentroidWithHoles,
	polygonSignedArea,
	polygonWinding,
	triangleArea,
	triangleSignedArea
} from '../src/index';

describe('cartesian polygon area', () => {
	const rectangle = [
		{ x: 0, y: 0 },
		{ x: 4, y: 0 },
		{ x: 4, y: 3 },
		{ x: 0, y: 3 }
	];

	it('calculates triangle signed and absolute area', () => {
		expect(
			triangleSignedArea(
				{ x: 0, y: 0 },
				{ x: 4, y: 0 },
				{ x: 0, y: 3 }
			)
		).toBe(6);
		expect(
			triangleArea(
				{ x: 0, y: 0 },
				{ x: 4, y: 0 },
				{ x: 0, y: 3 }
			)
		).toBe(6);
	});

	it('calculates polygon signed area and winding', () => {
		expect(polygonSignedArea(rectangle)).toBe(12);
		expect(polygonWinding(rectangle)).toBe('counterclockwise');

		const clockwise = [...rectangle].reverse();

		expect(polygonSignedArea(clockwise)).toBe(-12);
		expect(polygonWinding(clockwise)).toBe('clockwise');
	});

	it('treats explicitly closed rings the same as open rings', () => {
		expect(
			polygonArea([
				...rectangle,
				rectangle[0]!
			])
		).toBe(12);
	});

	it('returns degenerate winding for rings without area', () => {
		expect(
			polygonWinding([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 },
				{ x: 2, y: 2 }
			])
		).toBe('degenerate');
		expect(
			polygonArea([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 }
			])
		).toBe(0);
	});

	it('subtracts hole area regardless of hole winding', () => {
		const outer = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 10, y: 10 },
			{ x: 0, y: 10 }
		];
		const hole = [
			{ x: 3, y: 3 },
			{ x: 7, y: 3 },
			{ x: 7, y: 7 },
			{ x: 3, y: 7 }
		];

		expect(polygonAreaWithHoles(outer, [hole])).toBe(84);
		expect(polygonAreaWithHoles(outer, [[...hole].reverse()])).toBe(84);
	});

	it('sums areas across multiple polygons', () => {
		expect(
			multiPolygonArea([
				{ outer: rectangle },
				{
					outer: [
						{ x: 10, y: 10 },
						{ x: 12, y: 10 },
						{ x: 12, y: 12 },
						{ x: 10, y: 12 }
					]
				}
			])
		).toBe(16);
	});

	it('calculates polygon centroids regardless of winding or explicit closure', () => {
		expect(polygonCentroid(rectangle)).toEqual({ x: 2, y: 1.5 });
		expect(polygonCentroid([...rectangle].reverse())).toEqual({ x: 2, y: 1.5 });
		expect(
			polygonCentroid([
				...rectangle,
				rectangle[0]!
			])
		).toEqual({ x: 2, y: 1.5 });
	});

	it('returns null for degenerate polygon centroids', () => {
		expect(
			polygonCentroid([
				{ x: 0, y: 0 },
				{ x: 1, y: 1 },
				{ x: 2, y: 2 }
			])
		).toBeNull();
	});

	it('calculates centroids for polygons with holes and multipolygons', () => {
		const outer = [
			{ x: 0, y: 0 },
			{ x: 10, y: 0 },
			{ x: 10, y: 10 },
			{ x: 0, y: 10 }
		];
		const hole = [
			{ x: 0, y: 0 },
			{ x: 4, y: 0 },
			{ x: 4, y: 4 },
			{ x: 0, y: 4 }
		];

		expect(polygonCentroidWithHoles(outer, [hole])).toEqual({
			x: 39 / 7,
			y: 39 / 7
		});

		expect(
			multiPolygonCentroid([
				{ outer: rectangle },
				{
					outer: [
						{ x: 10, y: 10 },
						{ x: 12, y: 10 },
						{ x: 12, y: 12 },
						{ x: 10, y: 12 }
					]
				}
			])
		).toEqual({
			x: 4.25,
			y: 3.875
		});
	});
});

describe('geodesic polygon area', () => {
	const squareAtEquator = [
		{ latitude: 0, longitude: 0 },
		{ latitude: 0, longitude: 1 },
		{ latitude: 1, longitude: 1 },
		{ latitude: 1, longitude: 0 }
	];

	it('calculates signed and absolute geodesic area on a sphere', () => {
		const expectedArea =
			EARTH_RADIUS_METERS *
			EARTH_RADIUS_METERS *
			(Math.PI / 180) *
			Math.sin(Math.PI / 180);

		expect(geodesicPolygonSignedArea(squareAtEquator)).toBeCloseTo(expectedArea, -2);
		expect(geodesicPolygonArea(squareAtEquator)).toBeCloseTo(expectedArea, -2);
		expect(geodesicPolygonSignedArea([...squareAtEquator].reverse())).toBeCloseTo(
			-expectedArea,
			-2
		);
	});

	it('supports holes and multipolygon totals', () => {
		const outer = [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 2 },
			{ latitude: 2, longitude: 2 },
			{ latitude: 2, longitude: 0 }
		];
		const hole = [
			{ latitude: 0.5, longitude: 0.5 },
			{ latitude: 0.5, longitude: 1.5 },
			{ latitude: 1.5, longitude: 1.5 },
			{ latitude: 1.5, longitude: 0.5 }
		];

		const expected = geodesicPolygonArea(outer) - geodesicPolygonArea(hole);

		expect(geodesicPolygonAreaWithHoles(outer, [hole])).toBeCloseTo(expected, 6);
		expect(
			geodesicMultiPolygonArea([
				{ outer, holes: [hole] },
				{ outer: squareAtEquator }
			])
		).toBeCloseTo(expected + geodesicPolygonArea(squareAtEquator), 6);
	});

	it('calculates geodesic polygon centroids for triangles', () => {
		const triangle = [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 90 },
			{ latitude: 90, longitude: 0 }
		];
		const expectedLatitude = (Math.asin(1 / Math.sqrt(3)) * 180) / Math.PI;

		const centroid = geodesicPolygonCentroid(triangle, 1);
		const reversed = geodesicPolygonCentroid([...triangle].reverse(), 1);

		expect(centroid).not.toBeNull();
		expect(reversed).not.toBeNull();
		expect(centroid!.latitude).toBeCloseTo(expectedLatitude, 6);
		expect(centroid!.longitude).toBeCloseTo(45, 6);
		expect(reversed!.latitude).toBeCloseTo(expectedLatitude, 6);
		expect(reversed!.longitude).toBeCloseTo(45, 6);
	});

	it('calculates geodesic centroids for polygons with holes and multipolygons', () => {
		const outer = [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 90 },
			{ latitude: 90, longitude: 0 }
		];
		const hole = [
			{ latitude: 0, longitude: 45 },
			{ latitude: 45, longitude: 90 },
			{ latitude: 45, longitude: 0 }
		];
		const expectedLatitude = (Math.asin(1 / Math.sqrt(3)) * 180) / Math.PI;

		const centroidWithHole = geodesicPolygonCentroidWithHoles(outer, [hole], 1);
		const multiCentroid = geodesicMultiPolygonCentroid(
			[
				{ outer },
				{ outer: hole }
			],
			1
		);

		expect(centroidWithHole).not.toBeNull();
		expect(centroidWithHole!.latitude).toBeCloseTo(expectedLatitude, 6);
		expect(centroidWithHole!.longitude).toBeCloseTo(45, 6);

		expect(multiCentroid).not.toBeNull();
		expect(multiCentroid!.latitude).toBeCloseTo(expectedLatitude, 6);
		expect(multiCentroid!.longitude).toBeCloseTo(45, 6);
	});

	it('returns zero for rings with fewer than three unique points', () => {
		expect(
			geodesicPolygonArea([
				{ latitude: 0, longitude: 0 },
				{ latitude: 0, longitude: 1 }
			])
		).toBe(0);
		expect(
			geodesicPolygonCentroid([
				{ latitude: 0, longitude: 0 },
				{ latitude: 0, longitude: 1 }
			])
		).toBeNull();
	});

	it('handles polygons that cross the antimeridian', () => {
		const acrossDateline = [
			{ latitude: 0, longitude: 179 },
			{ latitude: 0, longitude: -179 },
			{ latitude: 1, longitude: -179 },
			{ latitude: 1, longitude: 179 }
		];

		const expectedArea =
			EARTH_RADIUS_METERS *
			EARTH_RADIUS_METERS *
			(2 * Math.PI / 180) *
			Math.sin(Math.PI / 180);

		expect(geodesicPolygonArea(acrossDateline)).toBeCloseTo(expectedArea, -2);
	});
});
