export type Cell = {
  ch: string;      // single character
  color?: string;  // CSS color (hex, rgb, etc.)
};

export type MapGrid = Cell[][]; // [y][x]

export type CellPatch = Partial<Cell> & { ch?: string };

export const MAP_W = 24 as const;
export const MAP_H = 24 as const;

export function makeEmptyMap(
  w: number = MAP_W,
  h: number = MAP_H,
  fill: Cell = { ch: "·", color: "rgba(230,225,216,0.85)" }
): MapGrid {
  return Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({ ...fill }))
  );
}
