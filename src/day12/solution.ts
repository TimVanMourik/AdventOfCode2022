import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/test.txt";

type Direction = [string, string];

function parseInstructions(input: string): Direction {
  const lines = parseStringList(input);
  return lines.map((line) => line.split("-")) as Direction;
}

export function day12(star: Star): number {
  const input = parseInstructions(INPUT_FILE);
  switch (star) {
    case Star.First: {
      return 0;
    }
    case Star.Second: {
      return 0;
    }
  }
}
