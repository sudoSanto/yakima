import React, { useLayoutEffect, useMemo, useRef, useState } from "react";

type MapCell = { c: string; color: string };
type AsciiMapData = { rows: MapCell[][] };

const VIEW = 12;

function buildAsciiGrid(size: number, ch = "x") {
  const row = ch.repeat(size);
  return Array.from({ length: size }, () => row).join("\n");
}

function measure(pre: HTMLElement) {
  const span = document.createElement("span");
  span.textContent = "XXXXXXXXXX";
  span.style.position = "absolute";
  span.style.visibility = "hidden";
  span.style.whiteSpace = "pre";
  span.style.font = getComputedStyle(pre).font;
  span.style.lineHeight = getComputedStyle(pre).lineHeight;

  document.body.appendChild(span);
  const rect = span.getBoundingClientRect();
  document.body.removeChild(span);

  return { charW: rect.width / 10, lineH: rect.height };
}

function isUsableMap(map: unknown): map is AsciiMapData {
  if (!map || typeof map !== "object") return false;
  const rows = (map as any).rows;
  if (!Array.isArray(rows) || rows.length === 0) return false;
  if (!rows.every(Array.isArray)) return false;
  // must have at least 1 cell somewhere
  return rows.some((r: any[]) => r.length > 0);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function AsciiMapMock({
  mapData,
  fallbackChar = "x",
  fallbackColor = "#e6e1d8",
}: {
  mapData?: AsciiMapData | unknown;
  fallbackChar?: string;
  fallbackColor?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);
  const [scaleX, setScaleX] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const pre = preRef.current;
    if (!wrap || !pre) return;

    const ro = new ResizeObserver(() => {
      const { charW, lineH } = measure(pre);
      const sx = lineH / charW;
      setScaleX(Number.isFinite(sx) ? sx : 1);
    });

    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const rendered = useMemo(() => {
    // No usable map => fixed VIEW×VIEW fallback
    if (!isUsableMap(mapData)) {
      return buildAsciiGrid(VIEW, fallbackChar);
    }

    const rows = mapData.rows;
    const H = rows.length;
    const W = Math.max(...rows.map((r) => r.length));

    // Center the window on the map’s center (no player coords yet)
    const centerY = Math.floor(H / 2);
    const centerX = Math.floor(W / 2);

    const half = Math.floor(VIEW / 2);
    const startY = centerY - half;
    const startX = centerX - half;

    const fallbackCell: MapCell = { c: fallbackChar, color: fallbackColor };

    return (
      <>
        {Array.from({ length: VIEW }, (_, vy) => {
          const y = startY + vy;
          return (
            <React.Fragment key={vy}>
              {Array.from({ length: VIEW }, (_, vx) => {
                const x = startX + vx;
                const cell =
                  y >= 0 &&
                  y < H &&
                  x >= 0 &&
                  x < (rows[y]?.length ?? 0)
                    ? rows[y][x]
                    : fallbackCell;

                return (
                  <span key={vx} style={{ color: cell.color }}>
                    {cell.c}
                  </span>
                );
              })}
              {"\n"}
            </React.Fragment>
          );
        })}
      </>
    );
  }, [mapData, fallbackChar, fallbackColor]);

  return (
    <div ref={wrapRef} className="asciiMap">
      <pre ref={preRef} style={{ transform: `scaleX(${scaleX})` }}>
        {rendered}
      </pre>
    </div>
  );
}
