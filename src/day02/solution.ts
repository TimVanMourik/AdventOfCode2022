import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day02.txt";

enum Direction {
  Forward = "forward",
  Up = "up",
  Down = "down",
}

type Instruction = [Direction, number];
type Distance = number;
type Depth = number;
type Aim = number;
type Location = [Distance, Depth];
type LocationAim = [Location, Aim];

function parseInstructions(input: string): Instruction[] {
  return parseStringList(input).map((line: string) => {
    const [direction, distance] = line.split(" ");
    return [direction as Direction, parseInt(distance)];
  });
}

export function day02(star: Star): number {
  const directions: Instruction[] = parseInstructions(INPUT_FILE);

  switch (star) {
    case Star.First: {
      const [distance, depth] = directions.reduce(
        (position, instruction) => updatePosition(position, instruction),
        [0, 0] as Location
      );
      console.log({ depth, distance });

      return depth * distance;
    }
    case Star.Second: {
      const [location, aim] = directions.reduce(
        (position, instruction) => updateAimAndPosition(position, instruction),
        [[0, 0], 0] as LocationAim
      );
      const [distance, depth] = location;
      console.log({ depth, distance, aim });

      return depth * distance;
    }
  }
}

function updatePosition(loc: Location, instruction: Instruction): Location {
  switch (instruction[0]) {
    case Direction.Forward:
      return [loc[0] + instruction[1], loc[1]];
    case Direction.Up:
      return [loc[0], loc[1] - instruction[1]];
    case Direction.Down:
      return [loc[0], loc[1] + instruction[1]];
  }
}

function updateAimAndPosition(
  loc: LocationAim,
  instruction: Instruction
): LocationAim {
  const [location, aim] = loc;
  switch (instruction[0]) {
    case Direction.Forward:
      return [
        [location[0] + instruction[1], location[1] + aim * instruction[1]],
        aim,
      ];
    case Direction.Up:
      return [location, aim - instruction[1]];
    case Direction.Down:
      return [location, aim + instruction[1]];
  }
}
