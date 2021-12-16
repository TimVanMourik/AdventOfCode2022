import { parseNumberGrid } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day15.txt";

type RiskMap = number[][];
type Coordinate = [number, number];
type DistanceMap = number[][];
type Unvisited = Set<string>;
type History = Coordinate[];
type Location = string;

interface Path {
  location: Coordinate;
  distance: number;
  history: History;
}

function parseInstructions(input: string): RiskMap {
  return parseNumberGrid(input);
}

export function day15(star: Star): number {
  const map = parseInstructions(INPUT_FILE);

  switch (star) {
    case Star.First: {
      const distances = dijkstra([0, 0], map);
      // printNumberGrid(distances, 4);
      return distances[map.length - 1][map[0].length - 1];
    }
    case Star.Second: {
      const bigMap = scaleGrid(map, 5);
      // printNumberGrid(bigMap);
      const distances = dijkstra([0, 0], bigMap);
      return distances[bigMap.length - 1][bigMap[0].length - 1];
    }
  }
}

function dijkstra(start: Coordinate, map: RiskMap): DistanceMap {
  const distances = Array.from({ length: map.length }, () =>
    Array.from({ length: map[0].length }, () => Infinity)
  );
  distances[start[0]][start[1]] = 0;
  const unvisited: Unvisited = new Set<Location>();
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      const coordinate = coord([x, y]);
      distances[x][y] = Infinity;
      unvisited.add(coordinate);
    }
  }

  let stack: Path[] = [{ location: start, distance: 0, history: [] }];
  while (unvisited.size > 0 || stack.length > 0) {
    const start = stack.splice(0, 1)[0];
    unvisited.delete(coord(start.location));
    const paths = evolve(start, distances, map);
    stack = [...stack, ...paths]
      .filter((p) => unvisited.has(coord(p.location)))
      .sort((a, b) => a.distance - b.distance);
  }

  return distances;
}

function evolve(current: Path, distances: DistanceMap, risk: RiskMap): Path[] {
  const [x0, y0] = current.location;
  const neighbours: Coordinate[] = [];
  if (x0 > 0) {
    neighbours.push([x0 - 1, y0]);
  }
  if (y0 > 0) {
    neighbours.push([x0, y0 - 1]);
  }
  if (x0 < risk.length - 1) {
    neighbours.push([x0 + 1, y0]);
  }
  if (y0 < risk[0].length - 1) {
    neighbours.push([x0, y0 + 1]);
  }
  const paths: Path[] = [];
  for (const neighbour of neighbours) {
    const [x1, y1] = neighbour;
    const newDistance = Math.min(
      current.distance + risk[x1][y1],
      distances[x1][y1]
    );
    distances[x1][y1] = newDistance;
    const path: Path = {
      location: neighbour,
      distance: newDistance,
      history: [...current.history, current.location],
    };
    paths.push(path);
  }

  return paths;
}

function scaleGrid(map: RiskMap, scale: number): RiskMap {
  const newMap = Array.from({ length: map.length * scale }, () =>
    Array.from({ length: map[0].length * scale }, () => 0)
  );
  for (let sx = 0; sx < scale; sx++) {
    for (let sy = 0; sy < scale; sy++) {
      for (let x = map.length * sx; x < map.length * (sx + 1); x++) {
        for (let y = map[0].length * sy; y < map[0].length * (sy + 1); y++) {
          const d = map[x % map.length][y % map[0].length] + sx + sy;
          newMap[x][y] = (d % 10) + Math.floor(d / 10);
        }
      }
    }
  }
  return newMap;
}

function coord(coordinate: Coordinate): string {
  return `${coordinate[0]},${coordinate[1]}`;
}
