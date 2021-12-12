import { readFileSync } from "fs";

export function readFile(input: string): string {
  return readFileSync(input, "utf8");
}

export function parseStringList(input: string): string[] {
  return readFile(input).split("\n").filter(Boolean);
}

export function parseNumberList(input: string): number[] {
  return parseStringList(input).map((n) => parseInt(n.toString(), 10));
}

export function parseNumberArray(input: string): number[] {
  return readFile(input)
    .split(",")
    .map((n) => parseInt(n.toString(), 10));
}
