#!/usr/bin/env node

import { day01 } from "./day01/solution";
import { day02 } from "./day02/solution";
import { day03 } from "./day03/solution";
import { day04 } from "./day04/solution";
import { day05 } from "./day05/solution";
import { day06 } from "./day06/solution";
import { day07 } from "./day07/solution";
import { day08 } from "./day08/solution";
import { day09 } from "./day09/solution";
import { day10 } from "./day10/solution";
import { day11 } from "./day11/solution";
import { day12 } from "./day12/solution";
import { day13 } from "./day13/solution";
import { day14 } from "./day14/solution";
import { day15 } from "./day15/solution";
import { Star } from "./star";

// parse argv

const args: string[] = process.argv.slice(2);
if (args.length <= 1 && args[0].localeCompare("day") !== 0) {
  throw new Error("Invalid arguments");
}

const day = Number(args[1]);
const star = (args[2] as Star) ?? Star.First;
let solution;
switch (day) {
  case 1:
    solution = day01(star);
    break;
  case 2:
    solution = day02(star);
    break;
  case 3:
    solution = day03(star);
    break;
  case 4:
    solution = day04(star);
    break;
  case 5:
    solution = day05(star);
    break;
  case 6:
    solution = day06(star);
    break;
  case 7:
    solution = day07(star);
    break;
  case 8:
    solution = day08(star);
    break;
  case 9:
    solution = day09(star);
    break;
  case 10:
    solution = day10(star);
    break;
  case 11:
    solution = day11(star);
    break;
  case 12:
    solution = day12(star);
    break;
  case 13:
    solution = day13(star);
    break;
  case 14:
    solution = day14(star);
    break;
  case 15:
    solution = day15(star);
    break;
}

console.log(`Solution day ${day}, ${star} star: ${solution}`);
