import { MAP_H, MAP_W, makeEmptyMap } from "./mapTypes";
import type { CellPatch, MapGrid }  from "./mapTypes";

type Listener = () => void;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export class MapService {
  private grid: MapGrid;
  private listeners = new Set<Listener>();

  constructor(initial?: MapGrid) {
    this.grid = initial ?? makeEmptyMap(MAP_W, MAP_H);
  }

  // React external-store contract
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.grid;

  private emit() {
    for (const l of this.listeners) l();
  }

  /** Replace the entire displayed map (must be 24x24 if you want strictness) */
  setMap(next: MapGrid) {
    this.grid = next;
    this.emit();
  }

  /** Safe replace with size normalization (pads/crops to 24x24) */
  setMapNormalized(next: MapGrid) {
    const h = MAP_H;
    const w = MAP_W;

    const normalized: MapGrid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => {
        const cell = next?.[y]?.[x];
        return cell ? { ch: cell.ch ?? " ", color: cell.color } : { ch: " ", color: undefined };
      })
    );

    this.grid = normalized;
    this.emit();
  }

  /** Patch one cell (immutable update) */
  patchCell(x: number, y: number, patch: CellPatch) {
    const yy = clamp(y, 0, this.grid.length - 1);
    const xx = clamp(x, 0, this.grid[0].length - 1);

    const prevRow = this.grid[yy];
    const prevCell = prevRow[xx];

    const nextCell = {
      ...prevCell,
      ...patch,
      ch: patch.ch ?? prevCell.ch,
    };

    // Immutable row + grid update
    const nextRow = prevRow.slice();
    nextRow[xx] = nextCell;

    const nextGrid = this.grid.slice();
    nextGrid[yy] = nextRow;

    this.grid = nextGrid;
    this.emit();
  }

  /** Convenience helpers */
  setCellChar(x: number, y: number, ch: string) {
    this.patchCell(x, y, { ch });
  }

  setCellColor(x: number, y: number, color?: string) {
    this.patchCell(x, y, { color });
  }

  clear(fillCh = "·") {
    this.grid = makeEmptyMap(MAP_W, MAP_H, { ch: fillCh });
    this.emit();
  }
}

// a simple singleton (or you can create per-page instances)
export const mapService = new MapService();
