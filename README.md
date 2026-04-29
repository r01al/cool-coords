# cool-coords

`cool-coords` is a TypeScript geometry library for coordinate calculations. It gives you one small API surface for both flat geometry and Earth-aware GPS math.

## ✨ Summary

Use `cool-coords` when you need to:

- 📏 Measure flat `x/y` distances, paths, bounds, and polygons
- 🧊 Measure 3D cartesian distances, paths, bounds, and midpoints
- 🌍 Measure GPS distances, bearings, paths, and areas on a spherical Earth model
- 🧮 Build distance matrices for both planar and geodesic coordinates
- 🧩 Group or analyze points without pulling in a large GIS stack

It supports both:

- 📐 Flat cartesian coordinates such as canvas points, SVG points, projected map points, and generic `x/y` data
- 🧊 3D cartesian coordinates such as point clouds, meshes, simulations, and generic `x/y/z` data
- 🛰️ Geographic coordinates such as GPS latitude/longitude on a spherical Earth model

The package is bundled with Rollup and ships:

- 📦 ESM output
- 📦 CommonJS output
- 🧠 TypeScript declaration files

## 🚀 Installation

```bash
npm install cool-coords
```

For local development:

```bash
npm install
npm run typecheck
npm test
npm run build
```

## 🧭 What This Library Covers

Current functionality includes:

- 📏 Euclidean distance and squared distance
- 🧊 3D Euclidean distance and squared distance
- 🧮 Distance matrix generation for flat coordinates
- 🧊 3D distance matrix generation
- ➰ Path length for flat coordinates
- 🧊 3D path length
- 📦 Bounding boxes and centroids
- 🧊 3D bounding boxes and centroids
- ↔️ Translation and midpoint helpers
- 🧊 3D translation and midpoint helpers
- 🧷 Point grouping by distance
- ⭕ Minimum enclosing circle
- 🌍 Great-circle distance and path length for GPS coordinates
- 🧮 Distance matrix generation for GPS coordinates
- 🧭 Initial bearing and destination point for GPS coordinates
- 🔷 Polygon area for flat coordinates
- 🎯 Polygon centroids for flat coordinates
- 🌐 Polygon area for GPS coordinates using Earth-radius-aware spherical calculations
- 🛰️ Polygon centroids for GPS coordinates
- 🕳️ Polygon holes and multipolygon totals for both flat and GPS coordinates

## 🗂️ Function Reference

### 📐 Flat Coordinates

| Function | Description | Example |
| --- | --- | --- |
| `squaredDistance` | Squared Euclidean distance for planar coordinates. | [Jump](#squareddistancea-b) |
| `distance` | Euclidean distance for planar coordinates. | [Jump](#distancea-b) |
| `createDistanceMatrix` | Symmetric distance matrix for planar points. | [Jump](#createdistancematrixpoints) |
| `pathLength` | Total length of a planar path or closed ring. | [Jump](#pathlengthpoints-closed) |
| `centroid` | Arithmetic mean of planar points. | [Jump](#centroidpoints) |
| `boundingBox` | Axis-aligned bounds for planar points. | [Jump](#boundingboxpoints) |
| `translate` | Offset a planar point by a delta. | [Jump](#translatepoint-delta) |
| `midpoint` | Midpoint between two planar points. | [Jump](#midpointa-b) |

### 🧊 3D Cartesian Coordinates

| Function | Description | Example |
| --- | --- | --- |
| `squaredDistance3D` | Squared Euclidean distance for 3D cartesian coordinates. | [Jump](#squareddistance3da-b) |
| `distance3D` | Euclidean distance for 3D cartesian coordinates. | [Jump](#distance3da-b) |
| `createDistanceMatrix3D` | Symmetric distance matrix for 3D cartesian points. | [Jump](#createdistancematrix3dpoints) |
| `pathLength3D` | Total length of a 3D cartesian path or closed ring. | [Jump](#pathlength3dpoints-closed) |
| `centroid3D` | Arithmetic mean of 3D cartesian points. | [Jump](#centroid3dpoints) |
| `boundingBox3D` | Axis-aligned bounds for 3D cartesian points. | [Jump](#boundingbox3dpoints) |
| `translate3D` | Offset a 3D cartesian point by a delta. | [Jump](#translate3dpoint-delta) |
| `midpoint3D` | Midpoint between two 3D cartesian points. | [Jump](#midpoint3da-b) |

### ⭕ Circle And Grouping

| Function | Description | Example |
| --- | --- | --- |
| `circleFromTwoPoints` | Circle whose diameter spans two points. | [Jump](#circlefromtwopointsa-b) |
| `circleFromThreePoints` | Circumcircle through three non-collinear points. | [Jump](#circlefromthreepointsa-b-c) |
| `isPointInCircle` | Test whether a point lies inside or on a circle. | [Jump](#ispointincirclepoint-circle) |
| `minimumEnclosingCircle` | Smallest circle that contains all points. | [Jump](#minimumenclosingcirclepoints) |
| `groupByDistance` | Connected clustering of planar points by threshold distance. | [Jump](#groupbydistancepoints-maxdistance) |

### 🔷 Flat Polygons

| Function | Description | Example |
| --- | --- | --- |
| `triangleSignedArea` | Signed planar area of a triangle. | [Jump](#trianglesignedareaa-b-c) |
| `triangleArea` | Absolute planar area of a triangle. | [Jump](#triangleareaa-b-c) |
| `polygonSignedArea` | Signed planar area of a polygon ring. | [Jump](#polygonsignedareapoints) |
| `polygonArea` | Absolute planar area of a polygon ring. | [Jump](#polygonareapoints) |
| `polygonCentroid` | Area-weighted centroid of a polygon ring. | [Jump](#polygoncentroidpoints) |
| `polygonWinding` | Winding direction of a polygon ring. | [Jump](#polygonwindingpoints) |
| `polygonAreaWithHoles` | Filled planar area after subtracting holes. | [Jump](#polygonareawithholesouterring-holes) |
| `polygonCentroidWithHoles` | Area-weighted centroid of a planar polygon with holes. | [Jump](#polygoncentroidwithholesouterring-holes) |
| `multiPolygonArea` | Total planar area across multiple polygons. | [Jump](#multipolygonareapolygons) |
| `multiPolygonCentroid` | Area-weighted centroid across multiple polygons. | [Jump](#multipolygoncentroidpolygons) |

### 🌍 Geographic Coordinates

| Function | Description | Example |
| --- | --- | --- |
| `haversineDistance` | Great-circle distance between two GPS coordinates. | [Jump](#haversinedistancea-b-radius) |
| `createGeodesicDistanceMatrix` | Symmetric great-circle distance matrix for GPS points. | [Jump](#creategeodesicdistancematrixpoints-radius) |
| `geodesicPathLength` | Total great-circle path length. | [Jump](#geodesicpathlengthpoints-closed-radius) |
| `initialBearing` | Initial bearing from one GPS coordinate to another. | [Jump](#initialbearinga-b) |
| `destinationPoint` | Destination reached from a start, distance, and bearing. | [Jump](#destinationpointstart-distance-bearing-radius) |
| `greatCircleMidpoint` | Midpoint along the great-circle arc. | [Jump](#greatcirclemidpointa-b) |
| `normalizeLongitude` | Normalize longitude into the `-180..180` range. | [Jump](#normalizelongitudelongitude) |

### 🌐 Geographic Polygons

| Function | Description | Example |
| --- | --- | --- |
| `geodesicPolygonSignedArea` | Signed spherical area of a polygon ring. | [Jump](#geodesicpolygonsignedareapoints-radius) |
| `geodesicPolygonArea` | Absolute spherical area of a polygon ring. | [Jump](#geodesicpolygonareapoints-radius) |
| `geodesicPolygonCentroid` | Area-weighted centroid of a spherical polygon ring. | [Jump](#geodesicpolygoncentroidpoints-radius) |
| `geodesicPolygonCentroidWithHoles` | Area-weighted centroid of a spherical polygon with holes. | [Jump](#geodesicpolygoncentroidwithholesouterring-holes-radius) |
| `geodesicPolygonAreaWithHoles` | Filled spherical area after subtracting holes. | [Jump](#geodesicpolygonareawithholesouterring-holes-radius) |
| `geodesicMultiPolygonArea` | Total spherical area across multiple polygons. | [Jump](#geodesicmultipolygonareapolygons-radius) |
| `geodesicMultiPolygonCentroid` | Area-weighted centroid across multiple spherical polygons. | [Jump](#geodesicmultipolygoncentroidpolygons-radius) |

## ⚡ Quick Start

Flat coordinates:

```ts
import { distance, createDistanceMatrix, polygonArea } from 'cool-coords';

distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5

createDistanceMatrix([
	{ x: 0, y: 0 },
	{ x: 3, y: 4 },
	{ x: 6, y: 4 }
]);

polygonArea([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 4, y: 3 },
	{ x: 0, y: 3 }
]); // 12
```

GPS coordinates:

```ts
import {
	createGeodesicDistanceMatrix,
	geodesicPolygonArea,
	haversineDistance
} from 'cool-coords';

haversineDistance(
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 }
);

createGeodesicDistanceMatrix([
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 }
]);

geodesicPolygonArea([
	{ latitude: 0, longitude: 0 },
	{ latitude: 0, longitude: 1 },
	{ latitude: 1, longitude: 1 },
	{ latitude: 1, longitude: 0 }
]);
```

## 🤔 Choose The Correct Coordinate Model

This is the most important decision in the library:

- 📐 Use flat helpers for already-projected or abstract `x/y` coordinates
- 🧊 Use 3D helpers for cartesian `x/y/z` coordinates
- 🌍 Use geodesic helpers for raw latitude/longitude GPS coordinates

Use cartesian helpers when your data looks like this:

```ts
{ x: number, y: number }
```

Use geodesic helpers when your data looks like this:

```ts
{ latitude: number, longitude: number }
```

Use 3D cartesian helpers when your data looks like this:

```ts
{ x: number, y: number, z: number }
```

This distinction matters:

- 📏 `distance()` treats coordinates as flat geometry
- 🌍 `haversineDistance()` treats coordinates as positions on Earth
- 🔷 `polygonArea()` returns area in square coordinate units
- 🌐 `geodesicPolygonArea()` returns area in square meters by default

⚠️ Do not use raw latitude/longitude with flat `x/y` formulas unless your coordinates have already been projected into a flat system.

## 🧱 Exported Types

```ts
export interface Coordinate {
	x: number;
	y: number;
}

export interface Coordinate3D {
	x: number;
	y: number;
	z: number;
}

export interface GeoCoordinate {
	latitude: number;
	longitude: number;
}

export interface PolygonShape<TPoint> {
	outer: TPoint[];
	holes?: TPoint[][];
}

export type WindingDirection =
	| 'clockwise'
	| 'counterclockwise'
	| 'degenerate';

export interface BoundingBox {
	min: Coordinate;
	max: Coordinate;
	width: number;
	height: number;
	center: Coordinate;
}

export interface BoundingBox3D {
	min: Coordinate3D;
	max: Coordinate3D;
	width: number;
	height: number;
	depth: number;
	center: Coordinate3D;
}

export interface Circle {
	center: Coordinate;
	radius: number;
}

export interface CoordinateGroup {
	points: Coordinate[];
	centroid: Coordinate;
	bounds: BoundingBox;
}
```

## 📝 Important Ring Rules

All polygon area helpers follow the same practical rules:

- 🔓 Rings may be open or explicitly closed
- 🔁 If the first point is repeated as the last point, the duplicate closing point is ignored
- 3️⃣ Fewer than 3 unique points means zero area
- 🕳️ Hole areas are subtracted by absolute area, regardless of hole winding direction
- 📐 The area helpers are intended for non-self-intersecting polygons

## 📚 API

If you just want the highlights:

- 📏 Flat distances and paths: `distance`, `squaredDistance`, `createDistanceMatrix`, `pathLength`
- 🧊 3D distances and paths: `distance3D`, `squaredDistance3D`, `createDistanceMatrix3D`, `pathLength3D`
- 🌍 GPS distances and paths: `haversineDistance`, `createGeodesicDistanceMatrix`, `geodesicPathLength`
- 📦 Shape helpers: `boundingBox`, `centroid`, `midpoint`, `translate`
- 🧊 3D shape helpers: `boundingBox3D`, `centroid3D`, `midpoint3D`, `translate3D`
- ⭕ Circle helpers: `circleFromTwoPoints`, `circleFromThreePoints`, `minimumEnclosingCircle`
- 🔷 Polygon helpers: `polygonArea`, `polygonCentroid`, `polygonAreaWithHoles`, `polygonCentroidWithHoles`, `multiPolygonArea`, `multiPolygonCentroid`
- 🌐 Geodesic polygon helpers: `geodesicPolygonArea`, `geodesicPolygonCentroid`, `geodesicPolygonAreaWithHoles`, `geodesicPolygonCentroidWithHoles`, `geodesicMultiPolygonArea`, `geodesicMultiPolygonCentroid`

### 📐 Flat Coordinate Helpers

#### `squaredDistance(a, b)`

Returns squared Euclidean distance.

Use this when you only need relative comparison and want to avoid `Math.sqrt`.

```ts
squaredDistance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 25
```

#### `distance(a, b)`

Returns Euclidean distance.

```ts
distance({ x: 0, y: 0 }, { x: 3, y: 4 }); // 5
```

#### `createDistanceMatrix(points)`

Returns an `N x N` Euclidean distance matrix for flat coordinates.

- The diagonal is always `0`
- The result is symmetric
- Returns `[]` for an empty input array

```ts
createDistanceMatrix([
	{ x: 0, y: 0 },
	{ x: 3, y: 4 },
	{ x: 6, y: 4 }
]);
// [
//   [0, 5, 7.211102550927978],
//   [5, 0, 3],
//   [7.211102550927978, 3, 0]
// ]
```

#### `pathLength(points, closed?)`

Returns total path length for a flat coordinate polyline.

- `closed = false`: sums each segment once
- `closed = true`: also adds the segment from last point back to first

```ts
pathLength(
	[
		{ x: 0, y: 0 },
		{ x: 3, y: 4 },
		{ x: 6, y: 4 }
	],
	false
); // 8
```

#### `centroid(points)`

Returns the arithmetic mean of all input points.

- Returns `null` for an empty array

```ts
centroid([
	{ x: 0, y: 0 },
	{ x: 2, y: 2 }
]); // { x: 1, y: 1 }
```

#### `boundingBox(points)`

Returns the minimum axis-aligned bounding box.

- Returns `null` for an empty array
- Result includes `min`, `max`, `width`, `height`, and `center`

```ts
boundingBox([
	{ x: -1, y: 3 },
	{ x: 4, y: 10 }
]);
```

#### `translate(point, delta)`

Moves a point by a delta.

```ts
translate({ x: 5, y: 10 }, { x: -2, y: 3 }); // { x: 3, y: 13 }
```

#### `midpoint(a, b)`

Returns the halfway point between two cartesian coordinates.

```ts
midpoint({ x: 0, y: 0 }, { x: 10, y: 6 }); // { x: 5, y: 3 }
```

### 🧊 3D Cartesian Helpers

#### `squaredDistance3D(a, b)`

Returns squared Euclidean distance in 3D.

```ts
squaredDistance3D(
	{ x: 0, y: 0, z: 0 },
	{ x: 2, y: 3, z: 6 }
); // 49
```

#### `distance3D(a, b)`

Returns Euclidean distance in 3D.

```ts
distance3D(
	{ x: 0, y: 0, z: 0 },
	{ x: 2, y: 3, z: 6 }
); // 7
```

#### `createDistanceMatrix3D(points)`

Returns an `N x N` Euclidean distance matrix for 3D cartesian coordinates.

- The diagonal is always `0`
- The result is symmetric
- Returns `[]` for an empty input array

```ts
createDistanceMatrix3D([
	{ x: 0, y: 0, z: 0 },
	{ x: 0, y: 3, z: 4 },
	{ x: 12, y: 3, z: 4 }
]);
```

#### `pathLength3D(points, closed?)`

Returns total path length for a 3D cartesian polyline.

```ts
pathLength3D([
	{ x: 0, y: 0, z: 0 },
	{ x: 0, y: 3, z: 4 },
	{ x: 12, y: 3, z: 4 }
]); // 17
```

#### `centroid3D(points)`

Returns the arithmetic mean of all input 3D points.

- Returns `null` for an empty array

```ts
centroid3D([
	{ x: 0, y: 0, z: 0 },
	{ x: 4, y: 2, z: 6 }
]); // { x: 2, y: 1, z: 3 }
```

#### `boundingBox3D(points)`

Returns the minimum axis-aligned bounding box in 3D.

- Returns `null` for an empty array
- Result includes `min`, `max`, `width`, `height`, `depth`, and `center`

```ts
boundingBox3D([
	{ x: -1, y: 3, z: 2 },
	{ x: 4, y: 10, z: 8 }
]);
```

#### `translate3D(point, delta)`

Moves a 3D point by a delta.

```ts
translate3D(
	{ x: 5, y: 10, z: -2 },
	{ x: -2, y: 3, z: 4 }
); // { x: 3, y: 13, z: 2 }
```

#### `midpoint3D(a, b)`

Returns the halfway point between two 3D cartesian coordinates.

```ts
midpoint3D(
	{ x: 0, y: 0, z: 0 },
	{ x: 10, y: 6, z: 2 }
); // { x: 5, y: 3, z: 1 }
```

### ⭕ Circle Helpers

#### `circleFromTwoPoints(a, b)`

Returns the circle whose diameter is the line segment from `a` to `b`.

```ts
circleFromTwoPoints(
	{ x: 0, y: 0 },
	{ x: 4, y: 0 }
); // { center: { x: 2, y: 0 }, radius: 2 }
```

#### `circleFromThreePoints(a, b, c)`

Returns the circumcircle passing through three points.

- Returns `null` when the points are collinear or nearly collinear

```ts
circleFromThreePoints(
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
	{ x: 1, y: 0 }
); // { center: { x: 0, y: 0 }, radius: 1 }
```

#### `isPointInCircle(point, circle)`

Checks whether a point lies inside or on the circle.

```ts
isPointInCircle(
	{ x: 1, y: 1 },
	{ center: { x: 0, y: 0 }, radius: 2 }
); // true
```

#### `minimumEnclosingCircle(points)`

Returns the smallest circle found that contains all points.

- Returns `null` for an empty input array
- Current implementation favors correctness and clarity over large-dataset optimization

```ts
minimumEnclosingCircle([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 2, y: 2 }
]);
```

### 🧷 Grouping Helper

#### `groupByDistance(points, maxDistance)`

Clusters flat points into connected groups.

Two points belong to the same group if they are directly or indirectly connected through links that are each `<= maxDistance`.

Each group contains:

- The original `points`
- A group `centroid`
- Group `bounds`

```ts
groupByDistance(
	[
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
		{ x: 10, y: 10 }
	],
	2
);
```

## 🔷 Polygon Area For Flat Coordinates

These helpers use standard planar geometry.
Areas are returned in square units of the input coordinate system.

- 📏 If your points are meters, the result is square meters.
- 🖼️ If your points are pixels, the result is square pixels.

For polygon centers:

- 🎯 `polygonCentroid()` returns the area-weighted centroid of the filled polygon
- 🧠 This is not the same as the arithmetic mean of vertices from `centroid()`
- 📦 This is also not the same as a bounding-box center

### `triangleSignedArea(a, b, c)`

Returns signed triangle area.

Sign convention:

- Positive: counterclockwise
- Negative: clockwise
- Zero: degenerate triangle

```ts
triangleSignedArea(
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 0, y: 3 }
); // 6
```

### `triangleArea(a, b, c)`

Returns absolute triangle area.

```ts
triangleArea(
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 0, y: 3 }
); // 6
```

### `polygonSignedArea(points)`

Returns signed polygon area using the shoelace formula.

Sign convention:

- Positive: counterclockwise ring
- Negative: clockwise ring
- Zero: degenerate polygon

```ts
polygonSignedArea([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 4, y: 3 },
	{ x: 0, y: 3 }
]); // 12
```

### `polygonArea(points)`

Returns absolute polygon area.

```ts
polygonArea([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 4, y: 3 },
	{ x: 0, y: 3 }
]); // 12
```

### `polygonCentroid(points)`

Returns the area-weighted centroid of a flat polygon.

- Returns `null` for degenerate polygons with zero area
- Winding direction does not change the result

```ts
polygonCentroid([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 4, y: 3 },
	{ x: 0, y: 3 }
]); // { x: 2, y: 1.5 }
```

### `polygonWinding(points)`

Returns ring orientation:

- `'counterclockwise'`
- `'clockwise'`
- `'degenerate'`

```ts
polygonWinding([
	{ x: 0, y: 0 },
	{ x: 4, y: 0 },
	{ x: 4, y: 3 },
	{ x: 0, y: 3 }
]); // 'counterclockwise'
```

### `polygonAreaWithHoles(outerRing, holes?)`

Returns outer polygon area minus all hole areas.

Important behavior:

- 🔁 Hole winding does not matter
- ➖ Hole areas are subtracted by absolute area
- ✅ You should provide geometrically valid input where holes lie inside the outer ring

```ts
polygonAreaWithHoles(
	[
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 10, y: 10 },
		{ x: 0, y: 10 }
	],
	[
		[
			{ x: 3, y: 3 },
			{ x: 7, y: 3 },
			{ x: 7, y: 7 },
			{ x: 3, y: 7 }
		]
	]
); // 84
```

### `polygonCentroidWithHoles(outerRing, holes?)`

Returns the centroid of the filled polygon after subtracting hole areas.

- Hole winding does not matter
- Returns `null` if the filled area is zero or degenerate

```ts
polygonCentroidWithHoles(
	[
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 10, y: 10 },
		{ x: 0, y: 10 }
	],
	[
		[
			{ x: 0, y: 0 },
			{ x: 4, y: 0 },
			{ x: 4, y: 4 },
			{ x: 0, y: 4 }
		]
	]
); // { x: 5.571428571428571, y: 5.571428571428571 }
```

### `multiPolygonArea(polygons)`

Returns the total area of multiple polygons.

Each polygon may include holes through the `PolygonShape<TPoint>` format.

```ts
multiPolygonArea([
	{
		outer: [
			{ x: 0, y: 0 },
			{ x: 4, y: 0 },
			{ x: 4, y: 3 },
			{ x: 0, y: 3 }
		]
	},
	{
		outer: [
			{ x: 10, y: 10 },
			{ x: 12, y: 10 },
			{ x: 12, y: 12 },
			{ x: 10, y: 12 }
		]
	}
]); // 16
```

### `multiPolygonCentroid(polygons)`

Returns the area-weighted centroid across multiple flat polygons.

- Each polygon may include holes
- Returns `null` when total filled area is zero

```ts
multiPolygonCentroid([
	{
		outer: [
			{ x: 0, y: 0 },
			{ x: 4, y: 0 },
			{ x: 4, y: 3 },
			{ x: 0, y: 3 }
		]
	},
	{
		outer: [
			{ x: 10, y: 10 },
			{ x: 12, y: 10 },
			{ x: 12, y: 12 },
			{ x: 10, y: 12 }
		]
	}
]); // { x: 4.25, y: 3.875 }
```

## 🌍 GPS And Earth-Radius-Aware Helpers

These helpers assume a spherical Earth model.

Default radius:

```ts
EARTH_RADIUS_METERS === 6_371_008.8
```

If you pass a custom radius, returned distance units follow that radius, and returned area units are that radius squared.

Good fit:

- 🛰️ Raw latitude/longitude from GPS, maps, or APIs
- 🌐 Measuring real-world distances on Earth
- 🧭 Bearing, destination, and geodesic path calculations
- 🎯 Area-weighted polygon centroids on the sphere

### `EARTH_RADIUS_METERS`

Default Earth radius constant used by geodesic helpers.

### `haversineDistance(a, b, radius?)`

Returns great-circle distance between two GPS coordinates.

- 📏 Default output unit: meters
- ✅ Requires latitude in `[-90, 90]`
- ✅ Requires longitude in `[-180, 180]`

```ts
const telAviv = { latitude: 32.0853, longitude: 34.7818 };
const jerusalem = { latitude: 31.7683, longitude: 35.2137 };

const meters = haversineDistance(telAviv, jerusalem);
```

### `createGeodesicDistanceMatrix(points, radius?)`

Returns an `N x N` great-circle distance matrix for GPS coordinates.

- 0️⃣ The diagonal is always `0`
- 🔁 The result is symmetric
- 📭 Returns `[]` for an empty input array
- 📏 Default output unit: meters

```ts
createGeodesicDistanceMatrix([
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 },
	{ latitude: 29.5577, longitude: 34.9519 }
]);
```

### `geodesicPathLength(points, closed?, radius?)`

Returns total great-circle path length for GPS coordinates.

```ts
geodesicPathLength([
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 },
	{ latitude: 29.5577, longitude: 34.9519 }
]);
```

### `initialBearing(a, b)`

Returns initial bearing in degrees from `a` to `b`.

- 🧭 Result is normalized to the range `0..360`

```ts
initialBearing(
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 }
);
```

### `destinationPoint(start, distance, bearing, radius?)`

Returns the GPS coordinate reached by traveling a given distance from a start point at a given bearing.

```ts
destinationPoint(
	{ latitude: 32.0853, longitude: 34.7818 },
	1000,
	45
);
```

### `greatCircleMidpoint(a, b)`

Returns the midpoint on the sphere between two GPS coordinates.

```ts
greatCircleMidpoint(
	{ latitude: 32.0853, longitude: 34.7818 },
	{ latitude: 31.7683, longitude: 35.2137 }
);
```

### `normalizeLongitude(longitude)`

Normalizes any longitude value into the range `-180..180`.

```ts
normalizeLongitude(190); // -170
```

## 🌐 Polygon Area For GPS Coordinates

These helpers measure area on a sphere instead of a flat plane.

- ✅ Use them for raw latitude/longitude rings.
- 🚫 Do not use flat `polygonArea()` for raw GPS coordinates.

For polygon centers:

- 🛰️ `geodesicPolygonCentroid()` gives you a centroid on the sphere
- 🧠 This differs from averaging latitudes and longitudes directly
- 🌍 Use it when your polygon is truly geographic, not projected `x/y`

### 📏 Units

- Default area unit: square meters
- Custom radius: result is in square units of that radius

### 🌐 Antimeridian Handling

Longitude deltas are normalized into the shortest `[-180, 180]` range.
That means polygons crossing the antimeridian are supported.

### `geodesicPolygonSignedArea(points, radius?)`

Returns signed spherical polygon area.

Sign convention is intentionally aligned with the flat polygon helpers:

- Positive: counterclockwise ring
- Negative: clockwise ring

```ts
geodesicPolygonSignedArea([
	{ latitude: 0, longitude: 0 },
	{ latitude: 0, longitude: 1 },
	{ latitude: 1, longitude: 1 },
	{ latitude: 1, longitude: 0 }
]);
```

### `geodesicPolygonArea(points, radius?)`

Returns absolute spherical polygon area.

```ts
geodesicPolygonArea([
	{ latitude: 0, longitude: 0 },
	{ latitude: 0, longitude: 1 },
	{ latitude: 1, longitude: 1 },
	{ latitude: 1, longitude: 0 }
]);
```

### `geodesicPolygonCentroid(points, radius?)`

Returns an area-weighted centroid for a polygon on the sphere.

- Output is a `{ latitude, longitude }` point
- Returns `null` for degenerate polygons with zero area
- Uses spherical weighting rather than flat `x/y` formulas

```ts
geodesicPolygonCentroid([
	{ latitude: 0, longitude: 0 },
	{ latitude: 0, longitude: 90 },
	{ latitude: 90, longitude: 0 }
]);
```

### `geodesicPolygonCentroidWithHoles(outerRing, holes?, radius?)`

Returns the centroid of the filled spherical polygon after subtracting hole areas.

- Hole winding does not matter
- Returns `null` when the filled area is zero

```ts
geodesicPolygonCentroidWithHoles(
	[
		{ latitude: 0, longitude: 0 },
		{ latitude: 0, longitude: 90 },
		{ latitude: 90, longitude: 0 }
	],
	[
		[
			{ latitude: 0, longitude: 45 },
			{ latitude: 45, longitude: 90 },
			{ latitude: 45, longitude: 0 }
		]
	]
);
```

### `geodesicPolygonAreaWithHoles(outerRing, holes?, radius?)`

Returns outer geodesic area minus all hole areas.

Hole winding is ignored and holes are subtracted by absolute area.

```ts
geodesicPolygonAreaWithHoles(
	[
		{ latitude: 0, longitude: 0 },
		{ latitude: 0, longitude: 2 },
		{ latitude: 2, longitude: 2 },
		{ latitude: 2, longitude: 0 }
	],
	[
		[
			{ latitude: 0.5, longitude: 0.5 },
			{ latitude: 0.5, longitude: 1.5 },
			{ latitude: 1.5, longitude: 1.5 },
			{ latitude: 1.5, longitude: 0.5 }
		]
	]
);
```

### `geodesicMultiPolygonArea(polygons, radius?)`

Returns the total area of multiple geodesic polygons.

### `geodesicMultiPolygonCentroid(polygons, radius?)`

Returns the area-weighted centroid across multiple geodesic polygons.

- Each polygon may include holes
- Returns `null` when total filled area is zero

```ts
geodesicMultiPolygonCentroid([
	{
		outer: [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 90 },
			{ latitude: 90, longitude: 0 }
		]
	},
	{
		outer: [
			{ latitude: 0, longitude: 45 },
			{ latitude: 45, longitude: 90 },
			{ latitude: 45, longitude: 0 }
		]
	}
]);
```

```ts
geodesicMultiPolygonArea([
	{
		outer: [
			{ latitude: 0, longitude: 0 },
			{ latitude: 0, longitude: 1 },
			{ latitude: 1, longitude: 1 },
			{ latitude: 1, longitude: 0 }
		]
	},
	{
		outer: [
			{ latitude: 2, longitude: 2 },
			{ latitude: 2, longitude: 3 },
			{ latitude: 3, longitude: 3 },
			{ latitude: 3, longitude: 2 }
		]
	}
]);
```

## Quick Examples

### Flat Polygon Area

```ts
import {
	polygonArea,
	polygonAreaWithHoles,
	polygonWinding
} from 'cool-coords';

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

const outerArea = polygonArea(outer);
const filledArea = polygonAreaWithHoles(outer, [hole]);
const winding = polygonWinding(outer);
```

### GPS Polygon Area

```ts
import {
	geodesicPolygonArea,
	geodesicPolygonAreaWithHoles,
	haversineDistance
} from 'cool-coords';

const ring = [
	{ latitude: 0, longitude: 0 },
	{ latitude: 0, longitude: 1 },
	{ latitude: 1, longitude: 1 },
	{ latitude: 1, longitude: 0 }
];

const area = geodesicPolygonArea(ring);
const distance = haversineDistance(ring[0], ring[1]);

const areaWithHole = geodesicPolygonAreaWithHoles(ring, [
	[
		{ latitude: 0.25, longitude: 0.25 },
		{ latitude: 0.25, longitude: 0.75 },
		{ latitude: 0.75, longitude: 0.75 },
		{ latitude: 0.75, longitude: 0.25 }
	]
]);
```

## Testing

The project includes automated tests for:

- Triangle and polygon area
- Signed vs absolute area
- Winding detection
- Hole subtraction
- Multipolygon totals
- Geodesic polygon area
- Antimeridian-crossing geodesic polygons

Run the tests with:

```bash
npm test
```

## Build Output

Build artifacts are written to:

- `dist/index.js`
- `dist/index.cjs`
- `dist/types/*.d.ts`

## Notes And Limitations

- Geodesic calculations use a spherical Earth model, not a full ellipsoidal geodesy model
- Polygon area helpers expect simple, non-self-intersecting rings
- Hole helpers subtract hole area but do not perform geometric validation that holes are truly inside the outer ring
- Flat area helpers operate purely in the coordinate units you provide

## License

MIT
