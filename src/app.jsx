/* global React, ReactDOM, Landing, Report, Offspring, useTweaks, TweaksPanel,
          TweakSection, TweakRadio, TweakColor, TweakSelect, TweakToggle */
const { useState: useAppState, useEffect: useAppEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "clinical",
  "density": "regular",
  "severityMode": "bar",
  "accent": "#a8543a",
  "previewState": "report"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mode, setMode] = useAppState("individual"); // individual | offspring
  const [data, setData] = useAppState(null);
  const [parent1, setParent1] = useAppState(null);
  const [parent2, setParent2] = useAppState(null);
  const [loading, setLoading] = useAppState(false);
  const [parentLoading, setParentLoading] = useAppState(null);

  // Apply theme + density to body
  useAppEffect(() => {
    document.body.setAttribute("data-theme", t.theme);
    document.body.setAttribute("data-density", t.density);
    if (t.accent) document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.theme, t.density, t.accent]);

  // Sync preview state from tweak — lets the reviewer jump between screens.
  // Only reacts to the previewState tweak; doesn't get triggered by other state changes.
  useAppEffect(() => {
    if (t.previewState === "landing") {
      setData(null); setParent1(null); setParent2(null); setMode("individual");
    } else if (t.previewState === "report") {
      setData(window.MOCK_SAMPLE); setMode("individual");
    } else if (t.previewState === "offspring") {
      setParent1({ filename: "father_genome.txt" });
      setParent2({ filename: "mother_genome.txt" });
      setMode("offspring");
    } else if (t.previewState === "offspring-intake") {
      setParent1(null); setParent2(null); setMode("offspring");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.previewState]);

  function handleUpload(meta) {
    setLoading(true);
    setTimeout(() => {
      setData(meta);
      setLoading(false);
    }, 700);
  }

  function handleParentUpload(n, meta) {
    setParentLoading(n);
    setTimeout(() => {
      if (n === 1) setParent1(meta);
      else setParent2(meta);
      setParentLoading(null);
    }, 600);
  }

  function reset() {
    setData(null);
    setParent1(null);
    setParent2(null);
  }

  const showLanding = (mode === "individual" && !data) || (mode === "offspring" && !(parent1 && parent2));

  return (
    <>
      <TopBar
        mode={mode}
        onModeChange={setMode}
        hasData={!!data || !!(parent1 && parent2)}
        onReset={reset}
      />

      {showLanding && mode === "individual" && (
        <Landing onUpload={handleUpload} loading={loading} />
      )}

      {showLanding && mode === "offspring" && (
        <OffspringIntake
          parent1={parent1}
          parent2={parent2}
          loading={parentLoading}
          onUpload={handleParentUpload}
        />
      )}

      {mode === "individual" && data && (
        <Report
          meta={data}
          findings={window.MOCK_FINDINGS}
          snps={window.MOCK_SNPS}
          severityMode={t.severityMode}
          onReset={reset}
        />
      )}

      {mode === "offspring" && parent1 && parent2 && (
        <Offspring
          p1={parent1}
          p2={parent2}
          onReset={reset}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Aesthetic" />
        <TweakRadio
          label="Theme"
          value={t.theme}
          options={["clinical", "editorial", "dark"]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#a8543a", "#7c5e3c", "#39ff88", "#2563eb", "#1e3a3a"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakRadio
          label="Severity"
          value={t.severityMode}
          options={["bar", "block"]}
          onChange={(v) => setTweak("severityMode", v)}
        />

        <TweakSection label="Preview" />
        <TweakSelect
          label="Screen"
          value={t.previewState}
          options={["landing", "report", "offspring-intake", "offspring"]}
          onChange={(v) => setTweak("previewState", v)}
        />
      </TweaksPanel>
    </>
  );
}

function TopBar({ mode, onModeChange, hasData, onReset }) {
  return (
    <div className="topbar">
      <div className="shell topbar-inner">
        <div className="row gap-3">
          <span className="wordmark">Locus<span style={{ color: "var(--accent)" }}>.</span></span>
          <span className="wordmark-meta">v2.0 · GRCh38</span>
        </div>
        <span className="spacer" />
        <div className="row gap-4">
          <button
            className="nav-link"
            aria-current={mode === "individual"}
            onClick={() => onModeChange("individual")}
          >
            Individual
          </button>
          <button
            className="nav-link"
            aria-current={mode === "offspring"}
            onClick={() => onModeChange("offspring")}
          >
            Offspring
          </button>
          <button className="nav-link">Methodology</button>
        </div>
        {hasData && (
          <button className="btn btn-sm btn-ghost" onClick={onReset} style={{ marginLeft: 16 }}>
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// OffspringIntake — dual upload landing for offspring mode
// ─────────────────────────────────────────────────────────────────
function OffspringIntake({ parent1, parent2, loading, onUpload }) {
  return (
    <div className="shell anim-fade-up" style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="tag" style={{ marginBottom: 14, display: "inline-block" }}>OFFSPRING MODE</span>
          <h1 className="font-display" style={{ fontSize: 52, margin: "12px 0 14px", fontWeight: 400, letterSpacing: "-0.018em" }}>
            Two genomes,<br/>
            one <em style={{ color: "var(--accent)" }}>predicted</em> profile.
          </h1>
          <p style={{ fontSize: 15, color: "var(--fg-mid)", maxWidth: 560, margin: "0 auto", lineHeight: 1.55 }}>
            Upload both parental raw genotype files. Locus computes a Mendelian
            inheritance grid for every variant in the catalog and reports the
            probability of risk-allele transmission per pregnancy.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", gap: 0, alignItems: "stretch" }}>
          <ParentSlot n={1} label="Parent A" sub="contributes one allele per locus" data={parent1} loading={loading === 1} onUpload={onUpload} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="font-display" style={{ fontSize: 40, color: "var(--fg-dim)" }}>×</div>
          </div>
          <ParentSlot n={2} label="Parent B" sub="contributes one allele per locus" data={parent2} loading={loading === 2} onUpload={onUpload} />
        </div>

        <div className="row gap-2" style={{ justifyContent: "center", marginTop: 32 }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              onUpload(1, { filename: "father_genome.txt" });
              onUpload(2, { filename: "mother_genome.txt" });
            }}
          >
            Or load two sample genomes ↗
          </button>
        </div>
      </div>
    </div>
  );
}

function ParentSlot({ n, label, sub, data, loading, onUpload }) {
  function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(n, { filename: file.name });
  }
  return (
    <div className="card" style={{ padding: 28, textAlign: "center", position: "relative" }}>
      <div className="font-mono" style={{ position: "absolute", top: 14, left: 18, fontSize: 10.5, color: "var(--fg-dim)", letterSpacing: "0.08em" }}>
        SAMPLE-{String(n).padStart(2, "0")}
      </div>
      <div className="font-display" style={{ fontSize: 28, fontWeight: 400, marginTop: 12 }}>{label}</div>
      <div className="dim" style={{ fontSize: 12.5, marginTop: 4, marginBottom: 22 }}>{sub}</div>

      {data ? (
        <div style={{ padding: 18, border: "1px solid var(--line)", borderRadius: 6, background: "var(--bg-sunk)" }}>
          <div className="font-mono" style={{ fontSize: 12, marginBottom: 6 }}>{data.filename}</div>
          <div className="dim" style={{ fontSize: 11.5 }}>638,472 calls · parsed locally</div>
          <button className="btn btn-sm btn-ghost" style={{ marginTop: 14 }} onClick={() => onUpload(n, null)}>Replace</button>
        </div>
      ) : (
        <label className="dropzone" style={{ display: "block" }}>
          <input type="file" accept=".txt,.csv,.zip" onChange={pick} style={{ display: "none" }} />
          {loading ? (
            <>
              <div className="spinner-small" />
              <div style={{ marginTop: 10, fontSize: 12 }} className="dim">parsing…</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13 }}>Drop raw file or click</div>
              <div className="font-mono dim" style={{ fontSize: 11, marginTop: 4 }}>txt · csv · zip</div>
            </>
          )}
        </label>
      )}

      <style>{`
        .spinner-small {
          width: 20px; height: 20px;
          border: 2px solid var(--line);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
