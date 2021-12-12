import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day08.txt";

type Digit = string;
type TenDigits = [
  Digit,
  Digit,
  Digit,
  Digit,
  Digit,
  Digit,
  Digit,
  Digit,
  Digit,
  Digit
];
type Output = [Digit, Digit, Digit, Digit];
interface SignalPattern {
  digits: TenDigits;
  output: Output;
}

function parseInstructions(input: string): SignalPattern[] {
  const lines = parseStringList(input);
  const signals = lines.map((line) => {
    const [digitsString, outputString] = line.split("|");
    const digits = digitsString.trim().split(" ") as TenDigits;
    const output = outputString.trim().split(" ") as Output;
    return { digits, output };
  });

  return signals;
}

export function day08(star: Star): number {
  const signals = parseInstructions(INPUT_FILE);
  switch (star) {
    case Star.First: {
      let easyNumbers = 0;
      for (const signal of signals) {
        for (const digit of signal.output) {
          if (
            digit.length === 2 || // 1
            digit.length === 3 || // 7
            digit.length === 4 || // 4
            digit.length === 7 // 8
          ) {
            easyNumbers++;
          }
        }
      }
      return easyNumbers;
    }
    case Star.Second: {
      const outputs = signals.map((signal) =>
        outputFromDigitMap(signal.output, buildDigitMap(signal.digits))
      );
      return outputs.reduce((acc, output) => acc + output, 0);
    }
  }
}

function outputFromDigitMap(
  output: Output,
  digitMap: Map<Digit, number>
): number {
  return output.reduce((acc, digit, index) => {
    const key = findKey(digitMap, digit);
    return acc + digitMap.get(key)! * Math.pow(10, 3 - index);
  }, 0);
}

function findKey(digitMap: Map<Digit, number>, digit: Digit): Digit {
  for (const key of digitMap.keys()) {
    if (
      [...key].every((char) => digit.includes(char)) &&
      [...digit].every((char) => key.includes(char))
    ) {
      return key;
    }
  }
  throw new Error("No key found");
}

function buildDigitMap(allDigits: TenDigits): Map<Digit, number> {
  const digitMap = new Map<Digit, number>();

  const one = allDigits.splice(
    allDigits.findIndex((digit) => digit.length === 2),
    1
  )[0];
  const seven = allDigits.splice(
    allDigits.findIndex((digit) => digit.length === 3),
    1
  )[0];
  const four = allDigits.splice(
    allDigits.findIndex((digit) => digit.length === 4),
    1
  )[0];
  const eight = allDigits.splice(
    allDigits.findIndex((digit) => digit.length === 7),
    1
  )[0];
  digitMap.set(one, 1);
  digitMap.set(seven, 7);
  digitMap.set(eight, 8);
  digitMap.set(four, 4);
  const nine = allDigits.splice(
    allDigits.findIndex((digit) =>
      Array.from(new Set([...seven, ...four])).every((char) =>
        digit.includes(char)
      )
    ),
    1
  )[0];
  digitMap.set(nine, 9);

  const lengthSix = allDigits.filter((digit) => digit.length === 6);
  lengthSix.forEach((digit) => {
    allDigits.splice(
      allDigits.findIndex((d) => d === digit),
      1
    );
  });
  const zero = lengthSix.splice(
    lengthSix.findIndex((digit) =>
      [...one].every((char) => digit.includes(char))
    ),
    1
  )[0];
  digitMap.set(zero, 0);
  const six = lengthSix[0];
  digitMap.set(six, 6);

  const three = allDigits.splice(
    allDigits.findIndex((digit) =>
      [...one].every((char) => digit.includes(char))
    ),
    1
  )[0];
  digitMap.set(three, 3);
  const five = allDigits.splice(
    allDigits.findIndex((digit) =>
      [...digit].every((char) => nine.includes(char))
    ),
    1
  )[0];
  digitMap.set(five, 5);
  const two = allDigits[0];
  digitMap.set(two, 2);

  return digitMap;
}
