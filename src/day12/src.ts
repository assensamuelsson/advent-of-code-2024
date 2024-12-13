import { product } from "../utils/array";

type Plants = string[][];
type Map = {
  rows: number,
  cols: number,
  plants: Plants,
};
type Point = [number, number];
type PointKey = number;
type GardenRegion = {
  points: Point[],
  plant: string,
  area: number,
  perimiter: number,
}
type PerimiterCalculator = (region: GardenRegion, map: Map) => void

export function part1(input: string) {
  const { regions } = parse(input, calculatePerimiter1);
  const result = regions
    .map(({ area, perimiter }) => area * perimiter)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function part2(input: string) {
  const { regions } = parse(input, calculatePerimiter2);
  const result = regions
    .map(({ area, perimiter }) => area * perimiter)
    .reduce((acc, curr) => acc + curr);

  console.log(result);
}

export function parse(input: string, calculatePerimiter: PerimiterCalculator): { map: Map, regions: GardenRegion[] } {
  const plants = input
    .split("\n")
    .map((row) => row.split(""));
  const rows = plants.length;
  const cols = plants[0].length;

  const map = { plants, rows, cols };

  const regions = findRegions(map, calculatePerimiter);

  return { map, regions };
}

function findRegions(map: Map, calculatePerimiter: PerimiterCalculator): GardenRegion[] {
  const { plants, rows, cols } = map;

  const searchedPoints = new Set<PointKey>();
  const regions: GardenRegion[] = [];

  for (const [ x, y ] of product(Array.from({ length: cols }, (_, i) => i), Array.from({ length: rows }, (_, i) => i))) {
    if (searchedPoints.has(pointKey([ x, y ]))) continue;

    const plant = plants[y][x];
    const points = floodFill([ x, y ], plants, searchedPoints);

    regions.push({ points, plant, area: points.length, perimiter: 0 });
  }

  regions.forEach((v) => calculatePerimiter(v, map));

  return regions;
}

function floodFill(point: Point, plants: Plants, searchedPoints: Set<PointKey>): Point[] {
  const result = [];
  const queue: Point[] = [ point ];
  const plant = getPlant(plants, point);

  while (queue.length) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const p = queue.pop()!;
    try {
      const key = pointKey(p);
      const [ x, y ] = p;
      if (getPlant(plants, p) === plant && !searchedPoints.has(key)) {
        searchedPoints.add(key);
        result.push(p);

        queue.push([ x + 1, y ]);
        queue.push([ x - 1, y ]);
        queue.push([ x, y + 1 ]);
        queue.push([ x, y - 1 ]);
      }
    } catch (error) {
      // To avoid index fiddeling...
    }
  }

  return result;
}

function pointKey(p: Point): PointKey {
  return p[0] * 1000 + p[1];
}

function getPlant(plants: Plants, point: Point): string {
  return plants[point[1]][point[0]];
}

export function calculatePerimiter1(region: GardenRegion) {
  const points = new Set(region.points.map(pointKey));

  const perimiter = region
    .points
    .reduce((acc, [ x, y ]) => {
      const closeBy = [
        [ x + 1, y ] as Point,
        [ x - 1, y ] as Point,
        [ x, y + 1 ] as Point,
        [ x, y - 1 ] as Point,
      ];

      return acc + closeBy.reduce((a, p) => a + (points.has(pointKey(p)) ? 0 : 1), 0);
    }, 0);

  region.perimiter = perimiter;
}

export function calculatePerimiter2(region: GardenRegion, map: Map) {
  const { plants, rows, cols } = map;
  const outerNodes = region
    .points
    .map(([ x, y ]) => {
      const dirs = [];
      if (x === 0 || getPlant(plants, [ x - 1, y ]) !== region.plant) dirs.push("left");
      if (x === cols - 1 || getPlant(plants, [ x + 1, y ]) !== region.plant) dirs.push("right");
      if (y === 0 || getPlant(plants, [ x, y - 1 ]) !== region.plant) dirs.push("up");
      if (y === rows - 1 || getPlant(plants, [ x, y + 1 ]) !== region.plant) dirs.push("down");

      if (dirs.length) {
        return { point: [ x, y ], dirs };
      } else {
        return null;
      }
    })
    .filter((node): node is { point: Point, dirs: string[] } => node !== null);

  const upNodes = outerNodes.filter((n) => n.dirs.includes("up"));
  const upNodeKeys = new Set(upNodes.map((n) => pointKey(n.point)));
  const downNodes = outerNodes.filter((n) => n.dirs.includes("down"));
  const downNodeKeys = new Set(downNodes.map((n) => pointKey(n.point)));
  const leftnodes = outerNodes.filter((n) => n.dirs.includes("left"));
  const leftNodeKeys = new Set(leftnodes.map((n) => pointKey(n.point)));
  const rightNodes = outerNodes.filter((n) => n.dirs.includes("right"));
  const rightNodeKeys = new Set(rightNodes.map((n) => pointKey(n.point)));

  const uniqueUpSides = upNodes
    .reduce((acc, { point: [ x, y ] }) => !upNodeKeys.has(pointKey([ x - 1, y ])) ? acc + 1 : acc, 0);

  const uniqueDownSides = downNodes
    .reduce((acc, { point: [ x, y ] }) => !downNodeKeys.has(pointKey([ x - 1, y ])) ? acc + 1 : acc, 0);

  const uniqueLeftSides = leftnodes
    .reduce((acc, { point: [ x, y ] }) => !leftNodeKeys.has(pointKey([ x, y - 1 ])) ? acc + 1 : acc, 0);

  const uniqueRightSides = rightNodes
    .reduce((acc, { point: [ x, y ] }) => !rightNodeKeys.has(pointKey([ x, y - 1 ])) ? acc + 1 : acc, 0);

  region.perimiter = uniqueUpSides + uniqueDownSides + uniqueLeftSides + uniqueRightSides;
}
