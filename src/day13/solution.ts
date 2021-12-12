import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/test.txt";

function parseInstructions(input: string): any {
  const lines = parseStringList(input);
  return lines;
}

export function day13(star: Star): number {
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
