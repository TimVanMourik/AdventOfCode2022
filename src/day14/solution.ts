import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day14.txt";

type Polymer = string;
type Insertion = [string, string];
type PolymerBucket = Map<string, number>;

function parseInstructions(input: string): [Polymer, Insertion[]] {
  const lines = parseStringList(input);
  const polymer = lines[0];
  const insertions = lines
    .slice(1)
    .map((line) => line.split(" -> ") as Insertion);
  return [polymer, insertions];
}

export function day14(star: Star): number {
  const [polymer, insertions] = parseInstructions(INPUT_FILE);
  const insertionMap = buildInsertionMap(insertions);

  switch (star) {
    case Star.First: {
      let chain = polymer;
      for (let i = 0; i < 10; i++) {
        chain = evolve(chain, insertionMap);
      }
      const countMap = makeElementCountMap(chain);

      const minElement = [...countMap.entries()].reduce(
        (min, elementCount) => (elementCount[1] < min[1] ? elementCount : min),
        ["", Infinity]
      );
      const maxElement = [...countMap.entries()].reduce(
        (max, elementCount) => (elementCount[1] > max[1] ? elementCount : max),
        ["", -Infinity]
      );
      return maxElement[1] - minElement[1];
    }
    case Star.Second: {
      let bucket = putPolymerInBucket(polymer);
      for (let i = 0; i < 40; i++) {
        bucket = bucketEvolve(bucket, insertionMap);
      }

      const countMap = bucketsToCountMap(polymer, bucket);
      const minElement = [...countMap.entries()].reduce(
        (min, elementCount) => (elementCount[1] < min[1] ? elementCount : min),
        ["", Infinity]
      );
      const maxElement = [...countMap.entries()].reduce(
        (max, elementCount) => (elementCount[1] > max[1] ? elementCount : max),
        ["", -Infinity]
      );
      return maxElement[1] - minElement[1];
    }
  }
}

function bucketEvolve(
  polymers: PolymerBucket,
  insertionMap: Map<string, string>
): PolymerBucket {
  const buckets = new Map<string, number>();
  for (const dual of polymers) {
    const [element, count] = dual;
    const addition = insertionMap.get(element);
    if (addition) {
      const first = element[0] + addition;
      const firstCount = buckets.get(first) ?? 0;
      buckets.set(first, firstCount + count);

      const second = addition + element[1];
      const secondCount = buckets.get(second) ?? 0;
      buckets.set(second, secondCount + count);
    }
  }

  return buckets;
}

function bucketsToCountMap(
  originalPolymer: Polymer,
  buckets: PolymerBucket
): Map<string, number> {
  const countMap = new Map<string, number>();
  for (const bucket of buckets) {
    const [element, count] = bucket;
    const firstCount = countMap.get(element[0]) ?? 0;
    countMap.set(element[0], firstCount + count);
    const secondCount = countMap.get(element[1]) ?? 0;
    countMap.set(element[1], secondCount + count);
  }

  countMap.set(originalPolymer[0], countMap.get(originalPolymer[0])! + 1);
  countMap.set(
    originalPolymer[originalPolymer.length - 1],
    countMap.get(originalPolymer[originalPolymer.length - 1])! + 1
  );
  for (const bucket of countMap) {
    countMap.set(bucket[0], bucket[1] / 2);
  }

  return countMap;
}

function putPolymerInBucket(polymer: Polymer): PolymerBucket {
  const bucket = new Map<string, number>();
  let lastElement = "";
  polymer.split("").forEach((element) => {
    if (!lastElement) {
      lastElement = element;
      return;
    }
    const dual = lastElement + element;
    const count = bucket.get(dual) ?? 0;
    bucket.set(dual, count + 1);
    lastElement = element;
  });
  return bucket;
}

function evolve(polymer: Polymer, insertionMap: Map<string, string>): Polymer {
  let chain = "";
  let lastElement = "";
  polymer.split("").forEach((element) => {
    const insertion = insertionMap.get(lastElement + element);
    chain += (insertion ?? "") + element;
    lastElement = element;
  });
  return chain;
}

function makeElementCountMap(chain: string): Map<string, number> {
  const elements = new Map<string, number>();
  chain.split("").forEach((element) => {
    const count = elements.get(element) ?? 0;
    elements.set(element, count + 1);
  });
  return elements;
}

function buildInsertionMap(insertion: Insertion[]): Map<string, string> {
  const insertionMap = new Map<string, string>();
  insertion.forEach(([from, to]) => insertionMap.set(from, to));
  return insertionMap;
}
