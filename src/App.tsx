import "./App.css";

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
    <section className="panel">
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
    </section>
  );
}

export default function App() {
  return (
    <div className="appContainer">
      <div className="title">
        <span>yakima</span>
      </div>

      <div className="frame">
        <div className="layout">
          <section className="panel hud">
            <div className="hudGrid">
              <div className="hudLeft">
                <div className="hudLine">Name</div>
                <div className="hudLine">HP / AP</div>
              </div>
              <div className="hudRight">
                <div className="hudLine">time till AP</div>
                <div className="hudLine">time till sleep</div>
              </div>
            </div>
          </section>

          <div className="input">
            <TerminalInput />
          </div>

          <div className="textReadout">
            <Panel title="Text Readout" />
          </div>

          <div className="asciiMap">
            <Panel title="ASCII map" />
          </div>

          <div className="objects">
            <Panel title="Interactable Objects" />
          </div>
        </div>
      </div>
    </div>
  );
}
