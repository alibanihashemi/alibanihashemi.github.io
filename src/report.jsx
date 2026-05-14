/* global React, Ideogram */
const { useState: useReportState, useMemo: useReportMemo } = React;

function Report({ meta, findings, snps, severityMode, onReset }) {
  const [filter, setFilter] = useReportState("all");
  const [category, setCategory] = useReportState("all");
  const [active, setActive] = useReportState(null);
  const [pageSize, setPageSize] = useReportState(40);

  const categories = useReportMemo(() => {
    const set = new Set(findings.map((f) => f.category));
    return ["all", ...Array.from(set).sort()];
  }, [findings]);

  const visible = findings.filter((f) => {
    if (filter === "high" && f.magnitude < 7) return false;
    if (filter === "mod"  && (f.magnitude < 5 || f.magnitude >= 7)) return false;
    if (filter === "low"  && f.magnitude >= 5) return false;
    if (category !== "all" && f.category !== category) return false;
    return true;
  });

  const shown = visible.slice(0, pageSize);
  const remaining = visible.length - shown.length;

  const agg = window.MOCK_AGG;

  return (
    <div className="report anim-fade-up">
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 56 }}>

        {/* File header */}
        <div className="report-head">
          <div>
            <div className="label">Report · Individual analysis</div>
            <h1 className="font-display" style={{ fontSize: 38, margin: "6px 0 6px", fontWeight: 400, letterSpacing: "-0.015em" }}>
              {meta.filename}
            </h1>
            <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--fg-mid)", flexWrap: "wrap" }}>
              <span className="font-mono">{meta.source}</span>
              <span className="dim">·</span>
              <span className="font-mono">{meta.totalSnps.toLocaleString()} calls</span>
              <span className="dim">·</span>
              <span className="font-mono">build GRCh38</span>
              <span className="dim">·</span>
              <span className="font-mono">parsed {new Date(meta.parsedAt || Date.now()).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
            </div>
          </div>
          <div className="row gap-2">
            <button className="btn">↓ Export PDF</button>
            <button className="btn btn-ghost" onClick={onReset}>Reset</button>
          </div>
        </div>

        {/* Executive summary */}
        <div className="exec-summary">
          <ExecCell label="Variants flagged" big={agg.total} subtitle={`of ${findings.length === agg.total ? "47" : "47"} tracked`} />
          <ExecCell label="High impact" big={agg.high} subtitle="magnitude ≥ 7" tone="high" />
          <ExecCell label="Moderate"  big={agg.mod}  subtitle="magnitude 5–6" tone="mod" />
          <ExecCell label="Informational" big={agg.low} subtitle="magnitude &lt; 5" tone="low" />
          <ExecCell label="Categories"  big={agg.categories.length} subtitle="affected" />
        </div>

        <div className="report-body">
          {/* Main content */}
          <main className="report-main">
            {/* Ideogram */}
            <section className="card" style={{ marginBottom: 24 }}>
              <Ideogram findings={findings} activeId={active} onHover={setActive} />
            </section>

            {/* Filter bar */}
            <div className="filter-bar">
              <div className="row gap-2" style={{ flexWrap: "wrap" }}>
                <FilterChip active={filter==="all"} onClick={() => setFilter("all")}>All <span className="count">{findings.length}</span></FilterChip>
                <FilterChip active={filter==="high"} onClick={() => setFilter("high")} tone="high">High <span className="count">{agg.high}</span></FilterChip>
                <FilterChip active={filter==="mod"}  onClick={() => setFilter("mod")} tone="mod">Moderate <span className="count">{agg.mod}</span></FilterChip>
                <FilterChip active={filter==="low"}  onClick={() => setFilter("low")} tone="low">Informational <span className="count">{agg.low}</span></FilterChip>
              </div>
              <select
                className="input"
                style={{ width: 180, fontFamily: "inherit", fontSize: 12.5 }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
                ))}
              </select>
            </div>

            <div className="risk-list">
              {shown.map((f, i) => (
                <RiskCard key={f.rsid} f={f} index={i+1} severityMode={severityMode} active={active === f.rsid} onHover={setActive} />
              ))}
              {remaining > 0 && (
                <button className="btn" style={{ alignSelf: "center", marginTop: 16 }} onClick={() => setPageSize(pageSize + 40)}>
                  Show {Math.min(40, remaining)} more <span className="font-mono dim" style={{ marginLeft: 6 }}>· {remaining} hidden</span>
                </button>
              )}
              {visible.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: "center" }}>
                  <div className="dim" style={{ fontSize: 14 }}>No findings match the current filter.</div>
                </div>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="report-sidebar">
            <Sidebar snps={snps} findings={findings} />
          </aside>
        </div>

      </div>

      <style>{`
        .report-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 28px;
        }
        .exec-summary {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0;
          border: 1px solid var(--line);
          background: var(--bg-raised);
          border-radius: var(--r-lg);
          margin-bottom: 32px;
          overflow: hidden;
        }
        @media (max-width: 920px) {
          .exec-summary { grid-template-columns: repeat(2, 1fr); }
        }
        .exec-cell {
          padding: 20px 22px;
          border-right: 1px solid var(--line);
          position: relative;
        }
        .exec-cell:last-child { border-right: none; }
        @media (max-width: 920px) {
          .exec-cell:nth-child(2n) { border-right: none; }
          .exec-cell { border-bottom: 1px solid var(--line); }
        }
        .exec-cell .big {
          font-family: var(--font-display);
          font-size: 44px;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 4px 0;
        }
        .exec-cell .big.is-high { color: var(--high); }
        .exec-cell .big.is-mod  { color: var(--mod); }
        .exec-cell .big.is-low  { color: var(--low); }

        .report-body {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 1080px) {
          .report-body { grid-template-columns: 1fr; }
        }
        .filter-bar {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--line);
        }
        .filter-chip {
          background: transparent;
          border: 1px solid var(--line);
          padding: 5px 11px;
          font-size: 12.5px;
          border-radius: 999px;
          cursor: pointer;
          color: var(--fg-mid);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .filter-chip:hover { background: var(--bg-sunk); color: var(--fg); }
        .filter-chip.is-active { background: var(--fg); color: var(--bg); border-color: var(--fg); }
        .filter-chip .count {
          font-family: var(--font-mono); font-size: 10.5px;
          padding: 1px 5px; border-radius: 3px;
          background: color-mix(in oklab, currentColor 12%, transparent);
        }
        .filter-chip.is-active .count {
          background: color-mix(in oklab, var(--bg) 25%, transparent);
        }
        .risk-list { display: flex; flex-direction: column; gap: 12px; }
      `}</style>
    </div>
  );
}

function ExecCell({ label, big, subtitle, tone }) {
  return (
    <div className="exec-cell">
      <div className="label">{label}</div>
      <div className={`big${tone ? ` is-${tone}` : ""}`}>{big}</div>
      <div className="dim" style={{ fontSize: 11.5 }} dangerouslySetInnerHTML={{ __html: subtitle }} />
    </div>
  );
}

function FilterChip({ active, onClick, children, tone }) {
  return (
    <button className={`filter-chip${active ? " is-active" : ""}`} onClick={onClick} data-tone={tone}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// RiskCard — the centerpiece. Designed to be scannable, with
// genotype displayed prominently in mono, severity expressed as a
// precise bar (not a loud color block).
// ─────────────────────────────────────────────────────────────────
function RiskCard({ f, index, severityMode, active, onHover }) {
  const tone = f.magnitude >= 7 ? "high" : f.magnitude >= 5 ? "mod" : "low";
  return (
    <article
      id={`risk-${f.rsid}`}
      className={`risk-card${active ? " is-active" : ""}`}
      data-tone={tone}
      data-severity-mode={severityMode}
      onMouseEnter={() => onHover?.(f.rsid)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="risk-side">
        <div className="risk-index font-mono">F-{String(index).padStart(2, "0")}</div>
        <div className={`risk-severity is-${tone}`} title={`Magnitude ${f.magnitude}/10`}>
          <div className="severity-track">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className={i < f.magnitude ? "on" : ""} />
            ))}
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: "var(--fg-dim)", marginTop: 6, letterSpacing: "0.06em" }}>
            MAG {f.magnitude}/10
          </div>
        </div>
      </div>

      <div className="risk-main">
        <div className="risk-head">
          <div>
            <div className="row gap-2" style={{ marginBottom: 8 }}>
              <span className="tag">{f.category}</span>
              <span className="tag" data-tone={tone}>
                {tone === "high" ? "High impact" : tone === "mod" ? "Moderate" : "Informational"}
              </span>
              <span className="tag">{f.match === "HO" ? "Homozygous" : "Heterozygous"}</span>
            </div>
            <h3 className="risk-title font-display">{f.condition}</h3>
            <div className="row gap-3" style={{ marginTop: 6, fontSize: 11.5, color: "var(--fg-dim)" }}>
              <span className="font-mono">{f.gene}</span>
              <span>·</span>
              <span className="font-mono">{f.rsid}</span>
              {f.chr && (<>
                <span>·</span>
                <span className="font-mono">chr{f.chr}</span>
              </>)}
              {f.section && (<>
                <span>·</span>
                <span className="dim">{f.section.replace(/-- /g, ' — ').slice(0, 40)}</span>
              </>)}
            </div>
          </div>

          <div className="risk-geno">
            <div className="label" style={{ marginBottom: 6 }}>Your call</div>
            <div className="geno geno-display">
              {f.userGeno.split("").map((ch, i) => (
                <span key={i} className={ch === f.riskAllele ? "risk-char" : ""}>{ch}</span>
              ))}
            </div>
            <div className="font-mono" style={{ fontSize: 10.5, color: "var(--fg-dim)", marginTop: 4 }}>
              risk allele <span style={{ color: "var(--accent)", fontWeight: 600 }}>{f.riskAllele}</span> ×{f.match === "HO" ? 2 : 1}
            </div>
          </div>
        </div>

        <p className="risk-desc">{f.description}</p>

        <div className="risk-meta">
          <span className="font-mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>
            §{" "}{f.section ? f.section.replace(/--.*/, '').trim() : f.category}
          </span>
          <span className="spacer" />
          <a className="risk-cite" href={`https://www.snpedia.com/index.php/${f.rsid}`} target="_blank" rel="noreferrer">
            <span className="font-mono">SNPedia · {f.rsid}</span>
            <span style={{ marginLeft: 4 }}>↗</span>
          </a>
        </div>
      </div>

      <style>{`
        .risk-card {
          display: grid;
          grid-template-columns: 64px 1fr;
          gap: 0;
          background: var(--bg-raised);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          overflow: hidden;
          transition: border-color 0.12s, background 0.12s;
        }
        .risk-card.is-active { border-color: var(--accent); }

        .risk-card[data-severity-mode="bar"] .risk-side {
          border-right: 1px solid var(--line);
        }
        .risk-card[data-severity-mode="block"] .risk-side {
          background: color-mix(in oklab, var(--accent) 6%, var(--bg-raised));
          border-right: 1px solid var(--line);
        }
        .risk-card[data-severity-mode="block"][data-tone="high"] .risk-side {
          background: color-mix(in oklab, var(--high) 11%, var(--bg-raised));
        }
        .risk-card[data-severity-mode="block"][data-tone="mod"] .risk-side {
          background: color-mix(in oklab, var(--mod) 11%, var(--bg-raised));
        }
        .risk-card[data-severity-mode="block"][data-tone="low"] .risk-side {
          background: color-mix(in oklab, var(--low) 8%, var(--bg-raised));
        }

        .risk-side {
          padding: 22px 14px;
          display: flex; flex-direction: column; align-items: center;
          gap: 16px;
          background: var(--bg-sunk);
        }
        .risk-index {
          font-size: 10px; letter-spacing: 0.08em;
          color: var(--fg-dim);
        }
        .severity-track {
          display: flex; flex-direction: column-reverse;
          gap: 2px;
          width: 8px;
        }
        .severity-track > span {
          height: 6px; width: 100%;
          background: var(--line);
          border-radius: 1px;
        }
        .risk-severity.is-high .severity-track > span.on { background: var(--high); }
        .risk-severity.is-mod  .severity-track > span.on { background: var(--mod); }
        .risk-severity.is-low  .severity-track > span.on { background: var(--low); }
        .risk-side > div + div {  }

        .risk-main {
          padding: 22px 26px 18px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .risk-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 24px;
        }
        .risk-title {
          font-size: 24px;
          font-weight: 400;
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.15;
        }
        .risk-geno {
          text-align: right;
          background: var(--bg-sunk);
          border: 1px solid var(--line);
          border-radius: var(--r-md);
          padding: 10px 14px;
          min-width: 110px;
        }
        .risk-geno .label { text-align: right; }
        .risk-desc {
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--fg-mid);
          margin: 0;
        }
        .risk-reco {
          background: var(--bg-sunk);
          border-left: 2px solid var(--accent);
          padding: 12px 16px;
          border-radius: 0 var(--r-sm) var(--r-sm) 0;
        }
        .risk-meta {
          display: flex; align-items: center;
          padding-top: 10px;
          border-top: 1px solid var(--line-soft);
        }
        .risk-cite {
          font-size: 11.5px;
          color: var(--fg-mid);
          text-decoration: none;
          padding: 3px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
        }
        .risk-cite:hover { background: var(--bg-sunk); color: var(--fg); }

        .tag[data-tone="high"] { color: var(--high); border-color: color-mix(in oklab, var(--high) 35%, var(--line)); }
        .tag[data-tone="mod"]  { color: var(--mod);  border-color: color-mix(in oklab, var(--mod) 35%, var(--line)); }
        .tag[data-tone="low"]  { color: var(--low);  border-color: color-mix(in oklab, var(--low) 35%, var(--line)); }

        @media (max-width: 720px) {
          .risk-head { flex-direction: column; }
          .risk-geno { text-align: left; align-self: stretch; }
          .risk-geno .label { text-align: left; }
        }
      `}</style>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sidebar — genome browser + summary
// ─────────────────────────────────────────────────────────────────
function Sidebar({ snps, findings }) {
  const [q, setQ] = useReportState("");
  const [tab, setTab] = useReportState("hits"); // hits | all
  const list = useReportMemo(() => {
    const lower = q.toLowerCase();
    const source = tab === "hits" ? snps.filter((s) => s.isFinding) : snps;
    if (!q) return source.slice(0, 400);
    return source.filter((s) =>
      s.rsid.toLowerCase().includes(lower) ||
      (s.gene || "").toLowerCase().includes(lower) ||
      (s.geno || "").toLowerCase().includes(lower)
    ).slice(0, 400);
  }, [q, tab, snps]);

  return (
    <div className="sidebar-stack">
      <div className="card sidebar-card">
        <div className="label" style={{ padding: "16px 18px 0" }}>Genome browser</div>
        <div className="row gap-2" style={{ padding: "10px 18px 0" }}>
          <button className={`mini-tab${tab==="hits"?" is-on":""}`} onClick={() => setTab("hits")}>Findings ({snps.filter(s=>s.isFinding).length})</button>
          <button className={`mini-tab${tab==="all"?" is-on":""}`}  onClick={() => setTab("all")}>All ({snps.length})</button>
        </div>
        <div style={{ padding: "10px 14px 8px" }}>
          <input
            className="input"
            placeholder="search rsid, gene, geno…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="snp-head">
          <span>RSID</span><span>GENE</span><span>GENO</span>
        </div>
        <div className="snp-list">
          {list.map((s) => (
            <div key={s.rsid} className={`snp-row${s.isFinding ? " is-hit" : ""}`}>
              <span className="font-mono snp-rsid">{s.rsid}</span>
              <span className="font-mono dim" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.gene || "—"}</span>
              <span className="font-mono">{s.geno || "—"}</span>
            </div>
          ))}
          {list.length === 0 && (
            <div className="dim" style={{ padding: 24, textAlign: "center", fontSize: 12 }}>No matches.</div>
          )}
        </div>
      </div>

      <div className="card sidebar-card">
        <div className="label" style={{ padding: "16px 18px 0" }}>Distribution</div>
        <div style={{ padding: "12px 18px 18px" }}>
          {window.MOCK_AGG.categories.map(([cat, n]) => {
            const pct = (n / findings.length) * 100;
            return (
              <div key={cat} style={{ padding: "7px 0" }}>
                <div className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
                  <span>{cat}</span>
                  <span className="font-mono dim">{n}</span>
                </div>
                <div className="magbar" style={{ marginTop: 5 }}>
                  <i style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .sidebar-stack { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 76px; }
        .sidebar-card { overflow: hidden; }
        .mini-tab {
          background: transparent;
          border: none; padding: 4px 0;
          font-size: 11.5px;
          color: var(--fg-dim);
          cursor: pointer;
          border-bottom: 1px solid transparent;
        }
        .mini-tab + .mini-tab { margin-left: 14px; }
        .mini-tab.is-on { color: var(--fg); border-bottom-color: var(--accent); }
        .snp-head {
          display: grid;
          grid-template-columns: 1fr 50px 50px;
          padding: 8px 18px;
          font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.06em;
          color: var(--fg-dim);
          background: var(--bg-sunk);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .snp-list { max-height: 360px; overflow-y: auto; }
        .snp-row {
          display: grid;
          grid-template-columns: 1fr 50px 50px;
          padding: 6px 18px;
          font-size: 11.5px;
          border-bottom: 1px solid var(--line-soft);
        }
        .snp-row:hover { background: var(--bg-sunk); }
        .snp-row.is-hit .snp-rsid { color: var(--accent); font-weight: 500; }
        .snp-list::-webkit-scrollbar { width: 6px; }
        .snp-list::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }
      `}</style>
    </div>
  );
}

window.Report = Report;
