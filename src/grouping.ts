import { distance } from './metrics';
import { boundingBox, centroid } from './geometry';
import type { Coordinate, CoordinateGroup } from './types';

export function groupByDistance(
  points: Coordinate[],
  maxDistance: number
): CoordinateGroup[] {
  if (!Number.isFinite(maxDistance) || maxDistance < 0) {
    throw new Error('maxDistance must be a finite number greater than or equal to 0.');
  }

  if (points.length === 0) {
    return [];
  }

  const parents = points.map((_, index) => index);

  for (let leftIndex = 0; leftIndex < points.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < points.length; rightIndex += 1) {
      if (distance(points[leftIndex]!, points[rightIndex]!) <= maxDistance) {
        union(parents, leftIndex, rightIndex);
      }
    }
  }

  const grouped = new Map<number, Coordinate[]>();

  for (let index = 0; index < points.length; index += 1) {
    const root = find(parents, index);
    const cluster = grouped.get(root);

    if (cluster) {
      cluster.push(points[index]!);
      continue;
    }

    grouped.set(root, [points[index]!]);
  }

  return [...grouped.values()].map((clusterPoints) => ({
    points: clusterPoints,
    centroid: centroid(clusterPoints)!,
    bounds: boundingBox(clusterPoints)!
  }));
}

function find(parents: number[], index: number): number {
  if (parents[index] !== index) {
    parents[index] = find(parents, parents[index]!);
  }

  return parents[index]!;
}

function union(parents: number[], leftIndex: number, rightIndex: number): void {
  const leftRoot = find(parents, leftIndex);
  const rightRoot = find(parents, rightIndex);

  if (leftRoot !== rightRoot) {
    parents[rightRoot] = leftRoot;
  }
}
