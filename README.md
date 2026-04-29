# cool-coords

`cool-coords` is a TypeScript geometry library for coordinate calculations.
It supports both:

- Flat cartesian coordinates such as canvas points, SVG points, projected map points, and generic `x/y` data
- Geographic coordinates such as GPS latitude/longitude on a spherical Earth model

The package is bundled with Rollup and ships:

- ESM output
- CommonJS output
- TypeScript declaration files

## Installation

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

## What This Library Covers

Current functionality includes:

- Euclidean distance and squared distance
- Path length for flat coordinates
- Bounding boxes and centroids
- Translation and midpoint helpers
- Point grouping by distance
- Minimum enclosing circle
- Great-circle distance and path length for GPS coordinates
- Initial bearing and destination point for GPS coordinates
- Polygon area for flat coordinates
- Polygon area for GPS coordinates using Earth-radius-aware spherical calculations
- Polygon holes and multipolygon totals for both flat and GPS coordinates

## Choose The Correct Coordinate Model

Use cartesian helpers when your data looks like this:

```ts
{ x: number, y: number }
```

Use geodesic helpers when your data looks like this:

```ts
{ latitude: number, longitude: number }
```

This distinction matters:

- `distance()` treats coordinates as flat geometry
- `haversineDistance()` treats coordinates as positions on Earth
- `polygonArea()` returns area in square coordinate units
- `geodesicPolygonArea()` returns area in square meters by default

Do not use raw latitude/longitude with flat `x/y` formulas unless your coordinates have already been projected into a flat system.

## Exported Types

```ts
export interface Coordinate {
  x: number;
  y: number;
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

## Important Ring Rules

All polygon area helpers follow the same practical rules:

- Rings may be open or explicitly closed
- If the first point is repeated as the last point, the duplicate closing point is ignored
- Fewer than 3 unique points means zero area
- Hole areas are subtracted by absolute area, regardless of hole winding direction
- The area helpers are intended for non-self-intersecting polygons

## API

### Flat Coordinate Helpers

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

### Circle Helpers

#### `circleFromTwoPoints(a, b)`

Returns the circle whose diameter is the line segment from `a` to `b`.

#### `circleFromThreePoints(a, b, c)`

Returns the circumcircle passing through three points.

- Returns `null` when the points are collinear or nearly collinear

#### `isPointInCircle(point, circle)`

Checks whether a point lies inside or on the circle.

#### `minimumEnclosingCircle(points)`

Returns the smallest circle found that contains all points.

- Returns `null` for an empty input array
- Current implementation favors correctness and clarity over large-dataset optimization

### Grouping Helper

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

## Polygon Area For Flat Coordinates

These helpers use standard planar geometry.
Areas are returned in square units of the input coordinate system.

If your points are meters, the result is square meters.
If your points are pixels, the result is square pixels.

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

- Hole winding does not matter
- Hole areas are subtracted by absolute area
- You should provide geometrically valid input where holes lie inside the outer ring

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

## GPS And Earth-Radius-Aware Helpers

These helpers assume a spherical Earth model.

Default radius:

```ts
EARTH_RADIUS_METERS === 6_371_008.8
```

If you pass a custom radius, returned distance units follow that radius, and returned area units are that radius squared.

### `EARTH_RADIUS_METERS`

Default Earth radius constant used by geodesic helpers.

### `haversineDistance(a, b, radius?)`

Returns great-circle distance between two GPS coordinates.

- Default output unit: meters
- Requires latitude in `[-90, 90]`
- Requires longitude in `[-180, 180]`

```ts
const telAviv = { latitude: 32.0853, longitude: 34.7818 };
const jerusalem = { latitude: 31.7683, longitude: 35.2137 };

const meters = haversineDistance(telAviv, jerusalem);
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

- Result is normalized to the range `0..360`

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

### `normalizeLongitude(longitude)`

Normalizes any longitude value into the range `-180..180`.

## Polygon Area For GPS Coordinates

These helpers measure area on a sphere instead of a flat plane.

Use them for raw latitude/longitude rings.
Do not use flat `polygonArea()` for raw GPS coordinates.

### Units

- Default area unit: square meters
- Custom radius: result is in square units of that radius

### Antimeridian Handling

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
