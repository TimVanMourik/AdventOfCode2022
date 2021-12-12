import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day09.txt";

type HeightMap = number[][];
type Uncharterd = boolean[][];
type BasinSizes = number[];
type Coordinate = [number, number];

function parseInstructions(input: string): HeightMap {
  const lines = parseStringList(input);
  return lines.map((line) => line.split("").map((c) => parseInt(c)));
}

export function day09(star: Star): number {
  const heightMap = parseInstructions(INPUT_FILE);

  const uncharterd = Array.from({ length: heightMap.length }, () =>
    Array.from({ length: heightMap[0].length }, () => true)
  );
  switch (star) {
    case Star.First: {
      for (const x of [...Array(heightMap.length).keys()]) {
        for (const y of [...Array(heightMap[0].length).keys()]) {
          setLowPoints(x, y, heightMap, uncharterd);
        }
      }
      return computeRisk(uncharterd, heightMap);
    }
    case Star.Second: {
      const basinSizes: BasinSizes = [];
      fillPeaks(heightMap, uncharterd, 9);
      for (const x of [...Array(heightMap.length).keys()]) {
        for (const y of [...Array(heightMap[0].length).keys()]) {
          if (uncharterd[x][y]) {
            basinSizes.push(chartBasin([x, y], heightMap, uncharterd));
          }
        }
      }
      basinSizes.sort((a, b) => a - b);
      const score = basinSizes.slice(basinSizes.length - 3);
      return score.reduce((product, size) => product * size, 1);
    }
  }
}

function chartBasin(
  coordinate: Coordinate,
  heightMap: HeightMap,
  uncharterd: Uncharterd
): number {
  const [x, y] = coordinate;
  uncharterd[x][y] = false;
  let size = 1;

  if (x !== 0 && uncharterd[x - 1][y]) {
    size += chartBasin([x - 1, y], heightMap, uncharterd);
  }
  if (y !== 0 && uncharterd[x][y - 1]) {
    size += chartBasin([x, y - 1], heightMap, uncharterd);
  }
  if (x !== heightMap.length - 1 && uncharterd[x + 1][y]) {
    size += chartBasin([x + 1, y], heightMap, uncharterd);
  }
  if (y !== heightMap[0].length - 1 && uncharterd[x][y + 1]) {
    size += chartBasin([x, y + 1], heightMap, uncharterd);
  }
  return size;
}

function fillPeaks(
  heightMap: HeightMap,
  basin: Uncharterd,
  peak: number
): void {
  for (const x of [...Array(heightMap.length).keys()]) {
    for (const y of [...Array(heightMap[0].length).keys()]) {
      if (heightMap[x][y] === peak) {
        {
          basin[x][y] = false;
        }
      }
    }
  }
}

function computeRisk(lowPoints: Uncharterd, heightMap: HeightMap): number {
  return lowPoints.reduce((sum, row, x) => {
    return (
      sum +
      row.reduce(
        (rowSum, cell, y) => rowSum + (cell ? heightMap[x][y] + 1 : 0),
        0
      )
    );
  }, 0);
}

function setLowPoints(
  x: number,
  y: number,
  heightMap: HeightMap,
  lowPoints: Uncharterd
): void {
  if (y !== 0 && heightMap[x][y - 1] >= heightMap[x][y]) {
    lowPoints[x][y - 1] = false;
  }
  if (x !== 0 && heightMap[x - 1][y] >= heightMap[x][y]) {
    lowPoints[x - 1][y] = false;
  }
  if (y !== heightMap[0].length - 1 && heightMap[x][y + 1] >= heightMap[x][y]) {
    lowPoints[x][y + 1] = false;
  }
  if (x !== heightMap.length - 1 && heightMap[x + 1][y] >= heightMap[x][y]) {
    lowPoints[x + 1][y] = false;
  }
}
