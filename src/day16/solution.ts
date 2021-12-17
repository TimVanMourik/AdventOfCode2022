import { readFile } from "../helpers/parseInput";
import { Star } from "../star";

const INPUT_FILE = "input/day16.txt";

type Bit = "0" | "1";

function parseInstructions(input: string): Bit[] {
  const s = readFile(input);
  const binaryString = [...s]
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
  return [...binaryString] as Bit[];
}

export function day16(star: Star): number {
  const input = parseInstructions(INPUT_FILE);

  switch (star) {
    case Star.First: {
      return readPacketVersionSum(input);
    }
    case Star.Second: {
      return readPacket(input);
    }
  }
}
//NOT 13091265688904

function readPacket(input: Bit[]): number {
  if (!input.length) {
    return 0;
  }
  while (input.length) {
    const version = parseInt(input.splice(0, 3).join(""), 2);
    const type = parseInt(input.splice(0, 3).join(""), 2);

    if (type === 4) {
      // Literal
      return readLiteral(input);
    }

    // Operator
    const packets: number[] = [];
    const lengthType = input.splice(0, 1)[0];
    if (lengthType === "0") {
      const length = parseInt(input.splice(0, 15).join(""), 2);
      const substring = input.splice(0, length);
      while (substring.length) {
        packets.push(readPacket(substring));
      }
    } else if (lengthType === "1") {
      const n = parseInt(input.splice(0, 11).join(""), 2);
      for (let i = 0; i < n; i++) {
        packets.push(readPacket(input));
      }
    }
    return applyOperator(type, packets);
  }
  return 0;
}

function readPacketVersionSum(input: Bit[]): number {
  if (!input.length) {
    return 0;
  }
  let sum = 0;
  while (input.length) {
    const version = parseInt(input.splice(0, 3).join(""), 2);
    const type = parseInt(input.splice(0, 3).join(""), 2);
    sum += version;
    switch (type) {
      case 4: {
        let proceed = true;
        let literal = "";
        while (proceed) {
          proceed = input.splice(0, 1)[0] === "1";
          literal += input.splice(0, 4).join("");
        }
        break;
      }
      default: {
        const lengthType = input.splice(0, 1)[0];
        if (lengthType === "0") {
          const length = parseInt(input.splice(0, 15).join(""), 2);
          const substring = input.splice(0, length);
          while (substring.length) {
            sum += readPacketVersionSum(substring);
          }
        } else if (lengthType === "1") {
          const n = parseInt(input.splice(0, 11).join(""), 2);
          for (let i = 0; i < n; i++) {
            const s = readPacketVersionSum(input);
            sum += s;
          }
        }
        break;
      }
    }
  }
  return sum;
}

function readLiteral(input: Bit[]) {
  let proceed = true;
  let literal = "";
  while (proceed) {
    proceed = input.splice(0, 1)[0] === "1";
    literal += input.splice(0, 4).join("");
  }
  return parseInt(literal, 2);
}

function applyOperator(operator: number, packets: number[]): number {
  switch (operator) {
    case 0: {
      return packets.reduce((a, b) => a + b, 0);
    }
    case 1: {
      return packets.reduce((a, b) => a * b, 1);
    }
    case 2: {
      return Math.min(...packets);
    }
    case 3: {
      return Math.max(...packets);
    }
    case 5: {
      return Number(packets[0] > packets[1]);
    }
    case 6: {
      return Number(packets[0] < packets[1]);
    }
    case 7: {
      return Number(packets[0] === packets[1]);
    }
    default: {
      throw new Error("Unknown operator");
    }
  }
}
