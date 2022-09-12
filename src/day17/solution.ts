import { readFile } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day17.txt";

type Range = [number, number];
type Area = [Range, Range];
type VelocityRangeMap = Map<number, Range>;

function parseInstructions(input: string): Area {
  const ranges = readFile(input).match(
    /target area: x=(?<x0>-?[0-9]*)..(?<x1>-?[0-9]*), y=(?<y0>-?[0-9]*)..(?<y1>-?[0-9]*)/
  )?.groups!;

  return [
    [parseInt(ranges.x0, 10), parseInt(ranges.x1, 10)],
    [parseInt(ranges.y0, 10), parseInt(ranges.y1, 10)],
  ];
}

export function day17(star: Star): number {
  const input = parseInstructions(INPUT_FILE);

  switch (star) {
    case Star.First: {
      return (input[1][0] * (input[1][0] + 1)) / 2;
    }
    case Star.Second: {
      const velocityMapX = makeVelocityRangeMapX();
      const velocityMapY = makeVelocityRangeMapY();
      return 0;
    }
  }
}

function minXVelocity(range: Range): number {
  return Math.ceil(Math.sqrt(2 * range[0] + 0.25 - 0.5));
}
function maxXVelocity(range: Range): number {
  return range[1];
}

function makeVelocityRangeMapX(): VelocityRangeMap {}
function makeVelocityRangeMapY(): VelocityRangeMap {}

function evolve(position: Range, direction: Range): void {
  const [x, y] = position;
  const [dx, dy] = direction;
  position[0] = x + dx;
  position[1] = y + dy;
  direction[0] = dx == 0 ? 0 : dx > 1 ? dx - 1 : dx + 1;
  direction[1] = dy - 1;
}
