import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day03.txt";

enum Bit {
  Zero = "0",
  One = "1",
}
type PowerConsumption = Bit[];

function parseInstructions(input: string): PowerConsumption[] {
  return parseStringList(input).map((c) => c.split("") as Bit[]);
}

export function day03(star: Star): number {
  const power: PowerConsumption[] = parseInstructions(INPUT_FILE);
  switch (star) {
    case Star.First: {
      const sum = bitSum(power);
      const gamma = parseInt(
        sum.map((s) => (s > power.length / 2 ? Bit.One : Bit.Zero)).join(""),
        2
      );
      const epsilon = Math.pow(2, sum.length) - gamma - 1;
      console.log({ gamma, epsilon });

      return gamma * epsilon;
    }
    case Star.Second: {
      let clone: PowerConsumption[] = JSON.parse(JSON.stringify(power));
      for (let index = 0; index < clone[0].length; index++) {
        const sum = bitSum(clone);
        const oxygenBit = sum[index] >= clone.length / 2 ? Bit.One : Bit.Zero;
        clone = clone.filter((p) => p[index] === oxygenBit);
      }
      if (clone.length !== 1) {
        throw new Error("Length does not equal one");
      }
      const oxygen = parseInt(clone[0].join(""), 2);

      clone = JSON.parse(JSON.stringify(power));
      for (let index = 0; index < clone[0].length; index++) {
        const sum = bitSum(clone);
        const carbondioxideBit =
          sum[index] >= clone.length / 2 ? Bit.Zero : Bit.One;
        if (clone.length === 1) {
          break;
        }
        clone = clone.filter((p) => p[index] === carbondioxideBit);
      }
      if (clone.length !== 1) {
        throw new Error("Length does not equal one");
      }
      const carbondioxide = parseInt(clone[0].join(""), 2);

      return oxygen * carbondioxide;
    }
  }
}

function bitSum(power: PowerConsumption[]): number[] {
  return power.reduce(
    (sum, p) => addPowerToSum(sum, p),
    Array.from({ length: power[0].length }, () => 0)
  );
}

function addPowerToSum(sum: number[], power: PowerConsumption): number[] {
  return sum.map((s, i) => s + (power[i] === Bit.One ? 1 : 0));
}
