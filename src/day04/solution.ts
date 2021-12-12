import { parseStringList } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day04.txt";

type CallList = number[];
type BingoCards = BingoCard[];
type BingoCard = number[][];
type CardMarks = boolean[][];

const CARD_SIZE = 5;

function parseInstructions(input: string): [CallList, BingoCards] {
  const lines = parseStringList(input);
  const callList = lines[0].split(",").map(Number);

  const bingoCards: BingoCard[] = [];
  let cardContent = lines.slice(1);
  while (cardContent.length > 0) {
    const card: BingoCard = [];
    for (let i = 0; i < CARD_SIZE; i++) {
      card.push(cardContent[i].trim().split(/[ ]+/).map(Number));
    }
    bingoCards.push(card);
    cardContent = cardContent.slice(CARD_SIZE);
  }

  return [callList, bingoCards];
}

export function day04(star: Star): number {
  const [callList, cards] = parseInstructions(INPUT_FILE);
  const cardMarks: CardMarks[] = Array.from({ length: cards.length }, () =>
    Array.from({ length: CARD_SIZE }, () =>
      Array.from({ length: CARD_SIZE }, () => false)
    )
  );
  switch (star) {
    case Star.First: {
      for (const call of callList) {
        for (let i = 0; i < cards.length; i++) {
          markNumberFromCard(call, cards[i], cardMarks[i]);
        }

        const hasBingo = cardMarks.map(checkForBingo);
        const bingo = hasBingo.indexOf(true);
        if (bingo !== -1) {
          console.log(`Bingo at ${bingo}, with ${call}`);

          return computeScore(cards[bingo], cardMarks[bingo]) * call;
        }
      }
      return 0;
    }
    case Star.Second: {
      let lastCard = -1;
      for (const call of callList) {
        for (let i = 0; i < cards.length; i++) {
          markNumberFromCard(call, cards[i], cardMarks[i]);
        }

        const hasBingo = cardMarks.map(checkForBingo);
        const sum = hasBingo.reduce((acc, b) => acc + (b ? 1 : 0), 0);
        if (sum === hasBingo.length - 1) {
          lastCard = hasBingo.indexOf(false);
        }
        if (sum === hasBingo.length) {
          console.log(`Bingo at ${lastCard}, with ${call}`);

          return computeScore(cards[lastCard], cardMarks[lastCard]) * call;
        }
      }
      return 0;
    }
  }
}

function markNumberFromCard(
  call: number,
  card: BingoCard,
  cardMark: CardMarks
): void {
  for (let i = 0; i < CARD_SIZE; i++) {
    for (let j = 0; j < CARD_SIZE; j++) {
      if (card[i][j] === call) {
        cardMark[i][j] = true;
      }
    }
  }
}

function checkForBingo(card: CardMarks): boolean {
  const horizontalMatch = card.some((row) =>
    row.every((mark) => mark === true)
  );
  if (horizontalMatch) {
    return true;
  }
  const transposedCard = transpose(card);
  const verticalMatch = transposedCard.some((row) =>
    row.every((mark) => mark === true)
  );
  if (verticalMatch) {
    return true;
  }
  return false;
}

function computeScore(card: BingoCard, marks: CardMarks): number {
  return marks.reduce((acc, row, i) => {
    return (
      acc +
      row.reduce((acc, mark, j) => {
        console.log(`${mark} ${card[i][j]}`);

        return mark ? acc : acc + card[i][j];
      }, 0)
    );
  }, 0);
}

function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}
