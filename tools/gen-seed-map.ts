import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type Cell = { c: string; color: string };
type MapJson = { rows: Cell[][] };

const N = 31;

// palette (still only ends up as color strings in JSON)
const COLORS = {
  bg: "#0f0f0f",
  building: "#6b6b6b",
  door: "#d6c38a",
  sidewalk: "#9a9a9a",
  street: "#3f3f3f",
  lane: "#c2b280",
  player: "#e6e1d8",
} as const;

function cell(c: string, color: string): Cell {
  return { c, color };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// Scene:
// - bottom-ish: building interior, a doorway
// - center: threshold/sidewalk
// - top-ish: city street with lane marks
function buildMap(): MapJson {
  const rows: Cell[][] = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => cell(" ", COLORS.bg))
  );

  const mid = Math.floor(N / 2);

  // Building block (bottom half)
  const bTop = Math.floor(N * 0.55);
  const bLeft = clamp(mid - 8, 0, N - 1);
  const bRight = clamp(mid + 8, 0, N - 1);

  for (let y = bTop; y < N; y++) {
    for (let x = bLeft; x <= bRight; x++) {
      // walls
      const isWall = y === bTop || y === N - 1 || x === bLeft || x === bRight;
      rows[y][x] = isWall ? cell("█", COLORS.building) : cell("·", COLORS.bg);
    }
  }

  // Door opening in the top wall of building
  const doorX = mid;
  rows[bTop][doorX - 1] = cell(" ", COLORS.bg);
  rows[bTop][doorX] = cell("+", COLORS.door); // door marker
  rows[bTop][doorX + 1] = cell(" ", COLORS.bg);

  // Sidewalk strip just above the building
  const sidewalkY = bTop - 1;
  for (let x = 0; x < N; x++) rows[sidewalkY][x] = cell("░", COLORS.sidewalk);

  // Street region above sidewalk
  const streetTop = 0;
  const streetBottom = sidewalkY - 1;
  for (let y = streetTop; y <= streetBottom; y++) {
    for (let x = 0; x < N; x++) rows[y][x] = cell("=", COLORS.street);
  }

  // Lane markings down the center-ish
  for (let y = streetTop + 1; y <= streetBottom - 1; y += 2) {
    rows[y][mid] = cell("|", COLORS.lane);
  }

  // Player just outside the door, stepping onto sidewalk
  rows[sidewalkY][mid] = cell("@", COLORS.player);

  return { rows };
}

const outPath = "src/maps/map.seed.json";
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(buildMap(), null, 2), "utf8");
console.log(`Wrote ${outPath}`);
