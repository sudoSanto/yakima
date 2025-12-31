import "./App.css";
import { useEffect } from "react";

import { AsciiMap, mapService } from "./features/map";
import { makeEmptyMap } from "./features/map/state/mapTypes";

function Panel({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="panelTitle">{title}</div>
      {children ? children : <div className="panelBody" />}
    </section>
  );
}

function TerminalInput() {
  return (
    <div className="terminalInput">
      <span className="inputPrompt">&gt;</span>
      <input
        type="text"
        className="inputField"
        placeholder="enter command..."
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    // Start with the default empty map (24x24)
    mapService.setMap(makeEmptyMap());

    // Optional proof it updates on the fly:
    mapService.patchCell(3, 10, { ch: "▣", color: "#008080" }); // teal-ish
    mapService.patchCell(14, 12, { ch: "E", color: "#ff0000" }); // enemy
  }, []);

  return (
    <div className="appContainer">
      <div className="title">
        <span>yakima</span>
      </div>

      <div className="frame">
        <div className="layout">

          <section className="hud panel">
            <div className="hudGrid">
              <div className="hudLeft">
                <div className="hudLine">Model 3R7Zy</div>
                <div className="hudLine">Healthy / █ █ █ █ █ ■ ≡ ≡ ≡ ≡</div>
                <div className="hudLine">Equiped:</div>
                <div className="hudLine">-Pistol (empty)</div>
                <div className="hudLine">-Leather Jacket</div>
              </div>
              <div className="hudRight">
                <div className="hudLine">time till AP</div>
                <div className="hudLine">time till sleep</div>
              </div>
            </div>
          </section>

          <div className="input panel">
            <TerminalInput />
          </div>

          <div className="textReadout">
            <Panel title="Uplink Terminal" />
          </div>

          <div className="asciiMap panel">
            <div className="mapSquare">
              <AsciiMap
                onCellClick={(x, y) => mapService.patchCell(x, y, { ch: "#", color: "rgba(230,225,216,0.85)" })}
              />
            </div>
          </div>

          <div className="objects">
            <Panel title="Sensors / Inventory" />
          </div>

        </div>
      </div>
    </div>
  );
}
