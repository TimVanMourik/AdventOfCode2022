export function printNumberGrid(map: number[][], size = 0) {
  let s = "";
  for (const row of map) {
    s += row.map((n) => n.toLocaleString().padStart(size, " ")).join("") + "\n";
  }
  console.log(s);
}
