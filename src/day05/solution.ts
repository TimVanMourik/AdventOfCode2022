import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day05.txt";

type Coordinate = [number, number];
type Vent = [Coordinate, Coordinate];
type VentMap = number[][];

function parseInstructions(input: string): Vent[] {
  const lines = parseStringList(input);
  const vents: Vent[] = lines.map(
    (line: string) =>
      line
        .split("->")
        .map(
          (coord) => coord.trim().split(",").map(Number) as Coordinate
        ) as Vent
  );
  return vents;
}

export function day05(star: Star): number {
  const vents = parseInstructions(INPUT_FILE);

  const max = findMax(vents);
  const ventMap: VentMap = Array.from({ length: max[1] + 1 }, () =>
    Array.from({ length: max[0] + 1 }, () => 0)
  );
  switch (star) {
    case Star.First: {
      for (const vent of vents) {
        const [start, end] = vent;
        if (start[0] !== end[0] && start[1] !== end[1]) {
          continue;
        }
        addStraightVents(ventMap, start, end);
      }
      print(ventMap);
      return computeScore(ventMap);
    }
    case Star.Second: {
      for (const vent of vents) {
        const [start, end] = vent;
        if (start[0] !== end[0] && start[1] !== end[1]) {
          addDiagonalVents(ventMap, start, end);
        } else {
          addStraightVents(ventMap, start, end);
        }
      }
      // print(ventMap);
      return computeScore(ventMap);
    }
  }
}

function addStraightVents(
  ventMap: VentMap,
  start: Coordinate,
  end: Coordinate
): void {
  const signX = start[0] < end[0] ? 1 : -1;
  const signY = start[1] < end[1] ? 1 : -1;
  for (let x = start[0]; signX * x <= signX * end[0]; x += signX) {
    for (let y = start[1]; signY * y <= signY * end[1]; y += signY) {
      ventMap[y][x] += 1;
    }
  }
}

function addDiagonalVents(
  ventMap: VentMap,
  start: Coordinate,
  end: Coordinate
): void {
  const signX = start[0] < end[0] ? 1 : -1;
  const signY = start[1] < end[1] ? 1 : -1;
  let [x, y] = start;
  while (signX * x <= signX * end[0]) {
    ventMap[y][x] += 1;
    x += signX;
    y += signY;
  }
}

function findMax(vents: Vent[]): Coordinate {
  const maxX = vents.reduce(
    (max, curr) => Math.max(max, curr[0][0]),
    -Infinity
  );
  const maxY = vents.reduce(
    (max, curr) => Math.max(max, curr[0][1]),
    -Infinity
  );

  return [maxX, maxY];
}

function computeScore(ventMap: VentMap): number {
  let overlap = 0;
  for (const row of ventMap) {
    for (const cell of row) {
      if (cell > 1) {
        overlap += 1;
      }
    }
  }
  return overlap;
}

function print(ventMap: VentMap) {
  for (const row of ventMap) {
    console.log(row.join(""));
  }
}
