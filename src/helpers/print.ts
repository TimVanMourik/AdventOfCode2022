export function printNumberGrid(map: number[][], size = 0) {
  let s = "";
  for (const row of map) {
    s +=
      row
        .map((n) => {
          const s = n.toLocaleString();
          return s.length < size ? s + new Array(size - s.length).join(" ") : s;
        })
        .join("") + "\n";
  }
  console.log(s);
}
