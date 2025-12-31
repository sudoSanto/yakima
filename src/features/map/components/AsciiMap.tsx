import React, { memo, useMemo } from "react";
import { useMapGrid } from "../state/useMap";
import { MapService, mapService } from "../state/mapService";
import { MAP_W } from "../state/mapTypes";

type Props = {
  service?: MapService;
  className?: string;
  onCellClick?: (x: number, y: number) => void;
};

const CellView = memo(function CellView({
  ch,
  color,
  x,
  y,
  onClick,
}: {
  ch: string;
  color?: string;
  x: number;
  y: number;
  onClick?: (x: number, y: number) => void;
}) {
  return (
    <span
      onClick={onClick ? () => onClick(x, y) : undefined}
      style={{
        display: "inline-block",
        width: "1ch",
        height: "1ch",
        color: color ?? "inherit",
        userSelect: "none",
        cursor: onClick ? "pointer" : "default",
      }}
      aria-label={`cell ${x},${y}`}
    >
      {ch}
    </span>
  );
});

export function AsciiMap({ service = mapService, className, onCellClick }: Props) {
  const grid = useMapGrid(service);

  const flat = useMemo(() => {
    // flatten once per grid update; 576 cells is fine
    const out: Array<{ x: number; y: number; ch: string; color?: string }> = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const c = grid[y][x];
        out.push({ x, y, ch: c.ch, color: c.color });
      }
    }
    return out;
  }, [grid]);

  return (
    <div
      className={className}
      style={{
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 12,
        lineHeight: "1.05em",
        letterSpacing: "0.08em",
        whiteSpace: "normal",
        display: "grid",
        gridTemplateColumns: `repeat(${MAP_W}, 1ch)`,
        gap: "0.25ch", // visible separation between characters
        paddingTop: 4,
        paddingRight: 12,
        paddingBottom: 12,
        paddingLeft: 12,
      }}
      role="grid"
      aria-label="ascii map"
    >
      {flat.map(({ x, y, ch, color }) => (
        <CellView key={`${x},${y}`} x={x} y={y} ch={ch} color={color} onClick={onCellClick} />
      ))}
    </div>
  );
}
