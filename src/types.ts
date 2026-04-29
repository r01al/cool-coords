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

export type WindingDirection = 'clockwise' | 'counterclockwise' | 'degenerate';

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
