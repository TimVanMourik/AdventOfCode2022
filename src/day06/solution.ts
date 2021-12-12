import { parseNumberArray } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day06.txt";

type Fishies = number[];
type Buckets = number[];

function parseInstructions(input: string): Fishies {
  return parseNumberArray(input);
}

export function day06(star: Star): number {
  const input = parseInstructions(INPUT_FILE);

  switch (star) {
    case Star.First: {
      const simulationTime = 80;
      let fishies: Fishies = [...input];
      for (let i = 0; i < simulationTime; i++) {
        fishies = evolve(fishies);
      }
      return fishies.length;
    }
    case Star.Second: {
      const simulationTime = 256;
      let buckets: Buckets = putFishiesInBuckets(input);
      for (let i = 0; i < simulationTime; i++) {
        buckets = evolveInBuckets(buckets);
      }
      return buckets.reduce((acc, bucket) => acc + bucket, 0);
    }
  }
}

function evolve(fishies: Fishies): Fishies {
  const newborns = fishies.filter((fish) => fish === 0).length;
  const newFishies: Fishies = fishies.map((fish) =>
    fish === 0 ? 6 : fish - 1
  );
  newFishies.push(...new Array(newborns).fill(8));
  return newFishies;
}

function putFishiesInBuckets(fishies: Fishies): Buckets {
  const buckets: Buckets = new Array(9).fill(0);
  for (const fish of fishies) {
    buckets[fish]++;
  }
  return buckets;
}

function evolveInBuckets(buckets: Buckets): Buckets {
  const newborns = buckets.shift() ?? 0;
  buckets[8] = newborns;
  buckets[6] += newborns;
  return buckets;
}
