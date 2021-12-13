import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day12.txt";

type Location = string;
type Direction = [Location, Location];
type DirectionMap = Map<Location, Location[]>;

const START = "start";
const END = "end";

function parseInstructions(input: string): Direction[] {
  const lines = parseStringList(input);
  return lines.map((line) => line.split("-") as Direction);
}

export function day12(star: Star): number {
  const directions = parseInstructions(INPUT_FILE);

  const directionMap: DirectionMap = new Map<Location, Location[]>();
  for (const direction of directions) {
    const [from, to] = direction;
    addDirection(from, to, directionMap);
    if (from !== START || to !== END) {
      addDirection(to, from, directionMap);
    }
  }

  switch (star) {
    case Star.First: {
      return computeTrajectories(START, directionMap, []);
    }
    case Star.Second: {
      return computeTrajectoriesWithMoreTime(START, directionMap, [], false);
    }
  }
}

function addDirection(
  from: Location,
  to: Location,
  directionMap: DirectionMap
): void {
  if (directionMap.has(from)) {
    directionMap.set(from, [...directionMap.get(from)!, to]);
  } else {
    directionMap.set(from, [to]);
  }
}

function computeTrajectories(
  start: Location,
  map: DirectionMap,
  history: Location[]
): number {
  if (start === END) {
    return 1;
  }
  if (isSmallCave(start) && history.includes(start)) {
    return 0;
  }
  const destinations = map.get(start);
  if (!destinations) {
    return 0;
  }
  let n = 0;
  for (const destination of destinations) {
    n += computeTrajectories(destination, map, [...history, start]);
  }

  return n;
}

function computeTrajectoriesWithMoreTime(
  start: Location,
  map: DirectionMap,
  history: Location[],
  spentExtraTime: boolean
): number {
  if (start === START && history.length) {
    return 0;
  }
  if (start === END) {
    return 1;
  }
  const destinations = map.get(start);
  if (!destinations) {
    return 0;
  }
  let n = 0;
  let spent = spentExtraTime;
  if (isSmallCave(start) && history.includes(start)) {
    if (spentExtraTime) {
      return 0;
    }
    spent = true;
  }
  for (const destination of destinations) {
    n += computeTrajectoriesWithMoreTime(
      destination,
      map,
      [...history, start],
      spent
    );
  }

  return n;
}

function isSmallCave(location: Location): boolean {
  return location.toLowerCase() === location;
}
