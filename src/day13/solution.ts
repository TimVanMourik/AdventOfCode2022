import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day13.txt";

enum Direction {
  Horizontal = "x",
  Vertical = "y",
}
type Coordinate = [number, number];
type Fold = [Direction, number];
type Paper = boolean[][];

function parseInstructions(input: string): [Coordinate[], Fold[]] {
  const lines = parseStringList(input);
  const coordinates: Coordinate[] = [];
  const folds: Fold[] = [];
  for (const line of lines) {
    if (line.trim().length === 0) {
      continue;
    }
    if (line.trim().startsWith("fold")) {
      const [, , value] = line.trim().split(" ");
      const [direction, amount] = value.split("=");
      folds.push([direction as Direction, parseInt(amount, 10)]);
    } else {
      const [x, y] = line
        .trim()
        .split(",")
        .map((n) => parseInt(n, 10));
      coordinates.push([x, y]);
    }
  }
  return [coordinates, folds];
}

export function day13(star: Star): number {
  const [coordinates, folds] = parseInstructions(INPUT_FILE);

  const maxX = coordinates.reduce((max, [x]) => Math.max(max, x), 0);
  const maxY = coordinates.reduce((max, [, y]) => Math.max(max, y), 0);

  const paper: Paper = Array.from({ length: maxX + 1 }, () =>
    Array.from({ length: maxY + 1 }, () => false)
  );
  markCoordinates(paper, coordinates);
  switch (star) {
    case Star.First: {
      for (const fold of [folds[0]]) {
        foldPaper(paper, fold);
      }
      return countMarks(paper);
    }
    case Star.Second: {
      for (const fold of folds) {
        foldPaper(paper, fold);
      }
      print(paper);
      return 0;
    }
  }
}

function foldPaper(paper: Paper, fold: Fold) {
  const [direction, distance] = fold;

  switch (direction) {
    case Direction.Horizontal: {
      for (let x = 1; x <= distance; x++) {
        for (let y = 0; y < paper[0].length; y++) {
          paper[distance - x][y] =
            paper[distance - x][y] || paper[distance + x][y];
        }
      }
      for (let x = 0; x < paper.length; x++) {
        paper.splice(distance, paper.length - distance + 1);
      }
      break;
    }
    case Direction.Vertical: {
      for (let x = 0; x < paper.length; x++) {
        for (let y = 1; y <= distance; y++) {
          paper[x][distance - y] =
            paper[x][distance - y] || paper[x][distance + y];
        }
      }
      for (let x = 0; x < paper.length; x++) {
        paper[x] = paper[x].slice(0, distance);
      }
      break;
    }
  }
}

function countMarks(paper: Paper) {
  return paper.reduce((sum, row) => sum + row.filter((mark) => mark).length, 0);
}

function markCoordinates(paper: Paper, coordinates: Coordinate[]) {
  for (const [x, y] of coordinates) {
    paper[x][y] = true;
  }
}

function print(paper: Paper) {
  let line = "";
  for (let x = 0; x < paper[0].length; x++) {
    for (let y = 0; y < paper.length; y++) {
      line += paper[y][x] ? "#" : ".";
    }
    line += "\n";
  }
  console.log(line);
}
