/* global React */
const { useState, useRef } = React;

function Landing({ onUpload, loading }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    onUpload({
      filename: file.name,
      source: "Detected: 23andMe v5",
      totalSnps: 638472,
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDrag(false);
    handleFile(e);
  }

  function useSample() {
    onUpload(window.MOCK_SAMPLE);
  }

  return (
    <div className="landing anim-fade-up">
      <div className="shell" style={{ paddingTop: 56, paddingBottom: 56 }}>

        {/* Hero */}
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="tag">v2.0 · BUILD 0413</span>
              <span className="dim" style={{ fontSize: 12 }}>
                Last variant catalog update · 12 days ago
              </span>
            </div>

            <h1 className="hero-title font-display">
              Read your genome.<br/>
              Understand what it<br/>
              <em>might</em> mean.
            </h1>

            <p className="hero-sub">
              Locus parses raw genotyping files from 23andMe, AncestryDNA and
              MyHeritage and surfaces 47 well-replicated risk variants with
              peer-reviewed citations. Everything runs in your browser — no
              upload, no account, no telemetry.
            </p>

            <div className="hero-meta">
              <Stat n="47" label="Variants tracked" />
              <Stat n="11" label="Categories" />
              <Stat n="38" label="PMIDs cited" />
              <Stat n="100%" label="Client-side" />
            </div>
          </div>

          {/* Upload card */}
          <div className="hero-right">
            <div className="card upload-card">
              <div className="upload-head">
                <span className="label">Step 01</span>
                <span className="font-mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>
                  *.txt · *.csv · *.zip
                </span>
              </div>

              <h3 style={{ margin: "8px 0 18px", fontSize: 17, fontWeight: 500 }}>
                Import a raw genotyping file
              </h3>

              <div
                className={`dropzone${drag ? " is-drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".txt,.csv,.zip"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
                {loading ? (
                  <>
                    <div className="spinner" />
                    <div style={{ marginTop: 14, fontSize: 13 }} className="dim">
                      Parsing genotype calls…
                    </div>
                  </>
                ) : (
                  <>
                    <DnaIcon />
                    <div style={{ marginTop: 14, fontWeight: 500 }}>
                      Drag your raw DNA file here
                    </div>
                    <div className="dim" style={{ fontSize: 12, marginTop: 4 }}>
                      or click to browse
                    </div>
                  </>
                )}
              </div>

              <div className="divider-mono" style={{ margin: "18px 0 14px" }}>or</div>

              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={useSample}>
                Try with a sample genome
                <span className="font-mono" style={{ opacity: 0.55, marginLeft: 6 }}>↗</span>
              </button>

              <p className="dim" style={{ fontSize: 11.5, marginTop: 14, lineHeight: 1.55 }}>
                Files are parsed entirely in your browser memory. Nothing is sent over the network.
                See <a style={{ color: "inherit" }} href="#methodology">methodology</a> for parser details.
              </p>
            </div>
          </div>
        </div>

        {/* Credibility strip */}
        <div className="cred-strip">
          <Cred
            title="Curated, not crowdsourced"
            body="Every variant in our catalog has at least one large-cohort, peer-reviewed primary source. Magnitudes follow the SNPedia convention."
            footer="38 PMIDs · 11 categories"
          />
          <Cred
            title="Local-first by design"
            body="Your raw data is parsed in WebAssembly inside your browser tab. The page works offline once loaded. Closing the tab forgets everything."
            footer="No upload · No account"
          />
          <Cred
            title="Not a diagnosis"
            body="Locus reports common, well-replicated SNPs only. Results are informational; clinical interpretation requires a board-certified genetic counselor."
            footer="Educational use only"
          />
        </div>

        {/* What we check */}
        <div className="catalog-block">
          <div className="catalog-head">
            <div>
              <div className="label">Catalog</div>
              <h2 className="font-display" style={{ fontSize: 30, margin: "2px 0 6px", fontWeight: 400 }}>
                What Locus checks
              </h2>
              <p className="dim" style={{ fontSize: 13, maxWidth: 520, margin: 0 }}>
                Distribution of tracked variants across phenotype categories.
                Each row links to the underlying literature.
              </p>
            </div>
            <span className="tag">47 ENTRIES</span>
          </div>

          <table className="catalog-table">
            <thead>
              <tr>
                <th>#</th><th>Category</th><th>Variants</th><th>Top gene</th><th>Notable condition</th><th></th>
              </tr>
            </thead>
            <tbody>
              {CATALOG_ROWS.map((r, i) => (
                <tr key={r.cat}>
                  <td className="font-mono dim">{String(i+1).padStart(2,"0")}</td>
                  <td>{r.cat}</td>
                  <td className="font-mono">{r.n}</td>
                  <td className="font-mono">{r.gene}</td>
                  <td>{r.notable}</td>
                  <td className="font-mono dim" style={{ textAlign: "right" }}>↗</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Methodology footer */}
        <div className="methodology" id="methodology">
          <div>
            <div className="label">§ Methodology</div>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: "4px 0 12px" }}>
              How a Locus report is built
            </h3>
            <ol className="method-list">
              <li><span>01</span><b>Parse.</b> Raw file is autodetected (provider, build, format) and decompressed locally. ~640k calls in &lt; 2 s.</li>
              <li><span>02</span><b>Match.</b> Each call is checked against the 47-variant risk catalog using rsID + allele orientation.</li>
              <li><span>03</span><b>Score.</b> Homozygous vs heterozygous matches are flagged separately. Magnitudes follow the published SNPedia scale.</li>
              <li><span>04</span><b>Cite.</b> Every finding links to its primary source PubMed entry. No model-generated recommendations.</li>
            </ol>
          </div>
          <div className="method-meta">
            <Meta k="Catalog version" v="2026.05.01" />
            <Meta k="Genome build" v="GRCh38" />
            <Meta k="Parser" v="WASM, ~2s for 640k SNPs" />
            <Meta k="License" v="CC BY-NC 4.0" />
            <Meta k="Source" v="github.com/locus/parser" />
          </div>
        </div>

      </div>

      <style>{`
        .hero {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 64px;
          align-items: start;
          padding-bottom: 56px;
          border-bottom: 1px solid var(--line);
        }
        @media (max-width: 920px) { .hero { grid-template-columns: 1fr; gap: 36px; } }
        .hero-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5.4vw, 72px);
          line-height: 1.02;
          letter-spacing: -0.018em;
          margin: 0 0 24px;
        }
        .hero-title em { font-style: italic; color: var(--accent); }
        .hero-sub {
          font-size: 16px;
          line-height: 1.55;
          color: var(--fg-mid);
          max-width: 480px;
          margin: 0 0 32px;
        }
        .hero-meta {
          display: grid;
          grid-template-columns: repeat(4, max-content);
          gap: 40px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
        }
        .upload-card { padding: 24px; }
        .upload-head { display: flex; justify-content: space-between; align-items: center; }
        .spinner {
          width: 28px; height: 28px;
          border: 2px solid var(--line);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .cred-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          margin: 48px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        @media (max-width: 920px) { .cred-strip { grid-template-columns: 1fr; } }
        .cred {
          padding: 28px 28px 28px 0;
          border-right: 1px solid var(--line);
        }
        .cred:nth-child(2) { padding-left: 28px; }
        .cred:nth-child(3) { padding-left: 28px; border-right: none; }
        .cred h4 {
          font-size: 14px; font-weight: 600; margin: 8px 0 10px;
        }
        .cred p { font-size: 13px; line-height: 1.55; color: var(--fg-mid); margin: 0 0 12px; }
        .cred-footer { font-family: var(--font-mono); font-size: 10.5px; color: var(--fg-dim); letter-spacing: 0.06em; text-transform: uppercase; }

        .catalog-block { margin: 56px 0; }
        .catalog-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; padding-bottom: 24px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 0;
        }
        .catalog-table {
          width: 100%; border-collapse: collapse; font-size: 14px;
        }
        .catalog-table th {
          text-align: left; font-weight: 500; font-size: 10.5px;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--fg-dim); padding: 14px 16px;
          border-bottom: 1px solid var(--line);
        }
        .catalog-table th:first-child { padding-left: 0; width: 36px; }
        .catalog-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--line-soft);
        }
        .catalog-table td:first-child { padding-left: 0; }
        .catalog-table tbody tr:hover td { background: var(--bg-sunk); }

        .methodology {
          margin: 56px 0 0;
          padding: 36px 0 16px;
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 64px;
        }
        @media (max-width: 920px) { .methodology { grid-template-columns: 1fr; gap: 32px; } }
        .method-list { padding: 0; margin: 0; list-style: none; }
        .method-list li {
          display: grid; grid-template-columns: 36px 1fr;
          padding: 14px 0;
          border-bottom: 1px solid var(--line-soft);
          font-size: 13.5px;
          color: var(--fg-mid);
          line-height: 1.55;
        }
        .method-list li > span {
          font-family: var(--font-mono); font-size: 11px;
          color: var(--fg-dim); padding-top: 2px;
        }
        .method-list li b { color: var(--fg); font-weight: 600; margin-right: 4px; }
        .method-meta {
          background: var(--bg-sunk);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          padding: 20px 24px;
        }
      `}</style>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-display" style={{ fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>{n}</div>
      <div className="label" style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Cred({ title, body, footer }) {
  return (
    <div className="cred">
      <span className="font-mono" style={{ fontSize: 10.5, color: "var(--fg-dim)", letterSpacing: "0.08em" }}>§</span>
      <h4>{title}</h4>
      <p>{body}</p>
      <div className="cred-footer">{footer}</div>
    </div>
  );
}

function Meta({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)", fontSize: 12 }}>
      <span className="dim">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

function DnaIcon() {
  // Restrained: just two crossing lines forming the helix idea, no full draw
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ color: "var(--accent)", margin: "0 auto", display: "block" }}>
      <path d="M6 3c0 6 12 6 12 12 0 3-2 6-6 6" />
      <path d="M18 3c0 6-12 6-12 12 0 3 2 6 6 6" />
      <path d="M8 7h8M7 11h10M7 15h10M8 19h8" strokeOpacity="0.4" />
    </svg>
  );
}

const CATALOG_ROWS = [
  { cat: "Neurology", n: 7, gene: "APOE", notable: "Late-onset Alzheimer's" },
  { cat: "Cardiology", n: 6, gene: "F5",    notable: "Factor V Leiden" },
  { cat: "Metabolism", n: 8, gene: "MTHFR", notable: "Folate metabolism C677T" },
  { cat: "Nutrition", n: 7, gene: "FTO",   notable: "Obesity / satiety signaling" },
  { cat: "Endocrinology", n: 4, gene: "TCF7L2", notable: "Type 2 diabetes" },
  { cat: "Oncology", n: 5, gene: "8q24",   notable: "Colorectal cancer locus" },
  { cat: "Carrier status", n: 4, gene: "HFE", notable: "Hereditary hemochromatosis" },
  { cat: "Pharmacogenomics", n: 3, gene: "CYP1A2", notable: "Caffeine metabolism" },
  { cat: "Cognitive", n: 3, gene: "COMT",  notable: "Stress / dopamine clearance" },
];

window.Landing = Landing;
