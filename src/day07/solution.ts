import { parseNumberArray } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day07.txt";

type Crabbies = number[];

function parseInstructions(input: string): Crabbies {
  return parseNumberArray(input);
}

export function day07(star: Star): number {
  const crabs = parseInstructions(INPUT_FILE);

  const max = Math.max(...crabs);
  switch (star) {
    case Star.First: {
      const fuel = new Array(max).fill(0).map((_, i) => fuelCost(crabs, i));
      return Math.min(...fuel);
    }
    case Star.Second: {
      const fuel = new Array(max)
        .fill(0)
        .map((_, i) => fuelCostQuadratic(crabs, i));
      return Math.min(...fuel);
    }
  }
}

function fuelCost(crabs: Crabbies, position: number): number {
  let fuel = 0;
  for (const pos of crabs) {
    fuel += Math.abs(pos - position);
  }
  return fuel;
}

function fuelCostQuadratic(crabs: Crabbies, position: number): number {
  let fuel = 0;
  for (const pos of crabs) {
    const distance = Math.abs(pos - position);
    fuel += (distance * (distance + 1)) / 2;
  }
  return fuel;
}
