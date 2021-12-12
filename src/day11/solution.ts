import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day11.txt";

type EnergyMap = number[][];
type FlashMap = boolean[][];

function parseInstructions(input: string): EnergyMap {
  const lines = parseStringList(input);
  return lines.map((line) => line.split("").map((c) => parseInt(c)));
}

export function day11(star: Star): number {
  const energyMap = parseInstructions(INPUT_FILE);
  switch (star) {
    case Star.First: {
      let flashed = 0;
      for (let i = 0; i < 100; i++) {
        flashed += propagate(energyMap);
      }
      return flashed;
    }
    case Star.Second: {
      let i = 0;
      while (true) {
        i++;
        const flashed = propagate(energyMap);
        if (flashed === energyMap.length * energyMap[0].length) {
          return i;
        }
      }
    }
  }
}

function propagate(energy: EnergyMap): number {
  for (let y = 0; y < energy.length; y++) {
    for (let x = 0; x < energy[y].length; x++) {
      energy[y][x] += 1;
    }
  }

  const flashMap = energy.map((row) => row.map(() => false));
  return flash(energy, flashMap);
}

function flash(energy: EnergyMap, flash: FlashMap): number {
  let recheck = false;
  while (!recheck) {
    recheck = true;
    for (let y = 0; y < energy.length; y++) {
      for (let x = 0; x < energy[y].length; x++) {
        if (!flash[y][x] && energy[y][x] > 9) {
          recheck = false;
          flash[y][x] = true;
          energy[y][x] = 0;
          incrementNeighbours(energy, flash, x, y);
        }
      }
    }
  }
  return flash.reduce(
    (sum, row) => sum + row.reduce((sum, cell) => sum + (cell ? 1 : 0), 0),
    0
  );
}

function incrementNeighbours(
  energy: EnergyMap,
  flash: FlashMap,
  x: number,
  y: number
): void {
  if (y > 0 && x > 0 && !flash[y - 1][x - 1]) {
    energy[y - 1][x - 1] += 1;
  }
  if (y > 0 && !flash[y - 1][x]) {
    energy[y - 1][x] += 1;
  }
  if (y > 0 && x < energy[y].length - 1 && !flash[y - 1][x + 1]) {
    energy[y - 1][x + 1] += 1;
  }
  if (x > 0 && !flash[y][x - 1]) {
    energy[y][x - 1] += 1;
  }
  if (x < energy[y].length - 1 && !flash[y][x + 1]) {
    energy[y][x + 1] += 1;
  }
  if (y < energy.length - 1 && x > 0 && !flash[y + 1][x - 1]) {
    energy[y + 1][x - 1] += 1;
  }
  if (y < energy.length - 1 && !flash[y + 1][x]) {
    energy[y + 1][x] += 1;
  }
  if (
    y < energy.length - 1 &&
    x < energy[y].length - 1 &&
    !flash[y + 1][x + 1]
  ) {
    energy[y + 1][x + 1] += 1;
  }
}
