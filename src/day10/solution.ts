import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day10.txt";
type OpeningBracket = "(" | "[" | "{" | "<";
type ClosingBracket = ")" | "]" | "}" | ">";
type Bracket = OpeningBracket | ClosingBracket;
type Brackets = Bracket[];

const bracketMap = new Map<Bracket, Bracket>();
bracketMap.set("(", ")");
bracketMap.set("[", "]");
bracketMap.set("{", "}");
bracketMap.set("<", ">");

const illegalCharacterMap = new Map<Bracket, number>();
illegalCharacterMap.set(")", 3);
illegalCharacterMap.set("]", 57);
illegalCharacterMap.set("}", 1197);
illegalCharacterMap.set(">", 25137);

const closingCharacterMap = new Map<Bracket, number>();
closingCharacterMap.set("(", 1);
closingCharacterMap.set("[", 2);
closingCharacterMap.set("{", 3);
closingCharacterMap.set("<", 4);

function parseInstructions(input: string): Brackets[] {
  const lines = parseStringList(input);
  return lines.map((line) => line.split("") as Brackets);
}

export function day10(star: Star): number {
  const brackets = parseInstructions(INPUT_FILE);
  switch (star) {
    case Star.First: {
      let error = 0;
      for (const line of brackets) {
        error += checkBrackets(line);
      }

      return error;
    }
    case Star.Second: {
      const scores: number[] = brackets
        .filter((line) => checkBrackets(line) === 0)
        .map((line) => findClosingTagScore(line));
      scores.sort((a, b) => a - b);
      return scores[(scores.length - 1) / 2];
    }
  }
}

function checkBrackets(brackets: Brackets): number {
  const stack: Bracket[] = [];
  for (const bracket of brackets) {
    if (bracketMap.has(bracket)) {
      stack.push(bracket);
    } else {
      const last = stack.pop()!;
      if (bracket !== bracketMap.get(last)) {
        return illegalCharacterMap.get(bracket)!;
      }
    }
  }
  return 0;
}

function findClosingTagScore(brackets: Brackets): number {
  const stack: Bracket[] = [];
  for (const bracket of brackets) {
    if (bracketMap.has(bracket)) {
      stack.push(bracket);
    } else {
      const last = stack.pop()!;
      if (bracket !== bracketMap.get(last)) {
        return illegalCharacterMap.get(bracket)!;
      }
    }
  }
  return stack
    .reverse()
    .reduce((acc, curr) => acc * 5 + closingCharacterMap.get(curr)!, 0);
}
