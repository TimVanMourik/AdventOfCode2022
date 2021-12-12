import { parseNumberList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day01.txt";

export function day01(star: Star): number {
  const depths: number[] = parseNumberList(INPUT_FILE);

  switch (star) {
    case Star.First:
      return slidingWindowIncreasing(depths, 1);

    case Star.Second:
      return slidingWindowIncreasing(depths, 3);
  }
}

function slidingWindowIncreasing(data: number[], n: number): number {
  let increasing = 0;
  let previousDepth = 0;

  data.slice(n).forEach((_, d) => {
    let depth = 0;
    for (let index = 0; index < n; index++) {
      depth += data[d + index];
    }
    if (depth > previousDepth) {
      increasing++;
    }
    previousDepth = depth;
  });
  return increasing;
}
