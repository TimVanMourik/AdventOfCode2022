import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/test.txt";

function parseInstructions(input: string): any {
  const lines = parseStringList(input);
  return lines;
}

export function day10(star: Star): number {
  switch (star) {
    case Star.First: {
      return 0;
    }
    case Star.Second: {
      return 0;
    }
  }
}
