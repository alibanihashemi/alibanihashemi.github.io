/* global React */
function Offspring({ p1, p2, onReset, onSwitchMode }) {
  // Compute Punnett-derived probability data once
  const predictions = window.MOCK_OFFSPRING.map(o => {
    const a1 = o.p1.split("");
    const a2 = o.p2.split("");
    const outcomes = [];
    for (const x of a1) for (const y of a2) outcomes.push([x, y].sort().join(""));
    const hetCount = outcomes.filter(c => c.includes(o.riskAllele) && !c.split("").every(x => x === o.riskAllele)).length;
    const homCount = outcomes.filter(c => c.split("").every(x => x === o.riskAllele)).length;
    const probAny = (hetCount + homCount) / 4;
    return { ...o, outcomes, probAny, hetCount, homCount };
  });

  const probAvg = predictions.reduce((s, p) => s + p.probAny, 0) / predictions.length;
  const carrierCount = predictions.filter(p => p.probAny > 0).length;

  return (
    <div className="offspring anim-fade-up">
      <div className="shell" style={{ paddingTop: 32, paddingBottom: 56 }}>

        <div className="report-head">
          <div>
            <div className="label">Report · Offspring inheritance prediction</div>
            <h1 className="font-display" style={{ fontSize: 38, margin: "6px 0 8px", fontWeight: 400, letterSpacing: "-0.015em" }}>
              Predicted child profile
            </h1>
            <div className="row gap-3" style={{ fontSize: 12.5, color: "var(--fg-mid)", flexWrap: "wrap" }}>
              <span className="font-mono">{p1.filename}</span>
              <span className="dim">×</span>
              <span className="font-mono">{p2.filename}</span>
              <span className="dim">·</span>
              <span className="font-mono">Mendelian autosomal model</span>
            </div>
          </div>
          <div className="row gap-2">
            <button className="btn">↓ Export PDF</button>
            <button className="btn btn-ghost" onClick={onReset}>Reset</button>
          </div>
        </div>

        {/* Top stats */}
        <div className="exec-summary">
          <div className="exec-cell">
            <div className="label">Variants analyzed</div>
            <div className="big">{predictions.length}</div>
            <div className="dim" style={{ fontSize: 11.5 }}>both parents called</div>
          </div>
          <div className="exec-cell">
            <div className="label">Inheritance likely</div>
            <div className="big">{carrierCount}</div>
            <div className="dim" style={{ fontSize: 11.5 }}>≥ 1 risk allele transmitted</div>
          </div>
          <div className="exec-cell">
            <div className="label">Avg probability</div>
            <div className="big" style={{ color: "var(--accent)" }}>{Math.round(probAvg*100)}%</div>
            <div className="dim" style={{ fontSize: 11.5 }}>across analyzed variants</div>
          </div>
          <div className="exec-cell">
            <div className="label">Homozygous risk</div>
            <div className="big">{predictions.filter(p => p.homCount > 0).length}</div>
            <div className="dim" style={{ fontSize: 11.5 }}>variants with HO probability</div>
          </div>
        </div>

        {/* Inheritance section */}
        <div className="row" style={{ justifyContent: "space-between", margin: "0 0 18px", paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
          <div>
            <div className="label">Predicted findings</div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 400, margin: "4px 0 0" }}>
              Per-variant inheritance probabilities
            </h2>
          </div>
          <span className="tag">SORT · BY PROBABILITY</span>
        </div>

        <div className="punnett-list">
          {predictions
            .slice()
            .sort((a, b) => b.probAny - a.probAny)
            .map((p, i) => <PunnettCard key={p.rsid} p={p} index={i+1} />)}
        </div>

        {/* Footer note */}
        <div className="model-note">
          <div className="label">§ Note on the inheritance model</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg-mid)", maxWidth: 720 }}>
            Locus uses a strict Mendelian autosomal model: each parent contributes one allele at
            random, with equal probability, independent across loci. This is a reasonable
            approximation for unlinked variants but does not model X-linked inheritance,
            mitochondrial DNA, imprinting effects, or recombination interference. For
            decisions related to family planning, please consult a board-certified genetic
            counselor.
          </p>
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
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid var(--line);
          background: var(--bg-raised);
          border-radius: var(--r-lg);
          margin-bottom: 40px;
          overflow: hidden;
        }
        @media (max-width: 720px) {
          .exec-summary { grid-template-columns: repeat(2, 1fr); }
        }
        .exec-cell {
          padding: 20px 22px;
          border-right: 1px solid var(--line);
        }
        .exec-cell:last-child { border-right: none; }
        .exec-cell .big {
          font-family: var(--font-display);
          font-size: 44px;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 4px 0;
        }
        .punnett-list { display: flex; flex-direction: column; gap: 16px; }
        .model-note {
          margin-top: 56px;
          padding-top: 28px;
          border-top: 1px solid var(--line);
        }
      `}</style>
    </div>
  );
}

function PunnettCard({ p, index }) {
  const tone = p.homCount > 0 ? "high" : p.hetCount === 4 ? "mod" : "low";
  const a1 = Array.from(new Set(p.p1.split("")));
  const a2 = Array.from(new Set(p.p2.split("")));
  // ensure 2-col axes; pad to 2 from original split if homozygous
  const ax1 = a1.length === 2 ? a1 : [a1[0], a1[0]];
  const ax2 = a2.length === 2 ? a2 : [a2[0], a2[0]];

  return (
    <article className="punnett-card" data-tone={tone}>
      <div className="punnett-side font-mono">
        <div className="dim" style={{ fontSize: 10, letterSpacing: "0.08em" }}>P-{String(index).padStart(2, "0")}</div>
        <div style={{ marginTop: 10, fontSize: 11.5 }}>{p.gene}</div>
        <div className="dim" style={{ fontSize: 10.5, marginTop: 2 }}>{p.rsid}</div>
      </div>

      <div className="punnett-main">
        <div className="row gap-2" style={{ marginBottom: 8 }}>
          <span className="tag">{p.category}</span>
          <span className="tag" data-tone={tone}>
            {tone === "high" ? "Homozygous possible" : tone === "mod" ? "All offspring carry" : "Carrier possible"}
          </span>
        </div>
        <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          {p.condition}
        </h3>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--fg-mid)", margin: "0 0 16px" }}>
          {p.description}
        </p>

        <div className="cross">
          {/* Father genotype */}
          <ParentBlock label="Parent 1" geno={p.p1} riskAllele={p.riskAllele} />
          <div className="cross-op font-display">×</div>
          {/* Mother genotype */}
          <ParentBlock label="Parent 2" geno={p.p2} riskAllele={p.riskAllele} />
        </div>

        <div className="row" style={{ marginTop: 14, gap: 8, fontSize: 11.5, color: "var(--fg-dim)" }}>
          <span className="font-mono">PMID {p.pmid}</span>
          <span className="dim">·</span>
          <span className="font-mono">risk allele <span style={{ color: "var(--accent)", fontWeight: 600 }}>{p.riskAllele}</span></span>
        </div>
      </div>

      {/* Punnett square */}
      <div className="punnett-viz">
        <div className="label" style={{ marginBottom: 10, textAlign: "center" }}>Punnett · per pregnancy</div>
        <div className="punnett">
          <div className="punnett-corner"></div>
          {ax2.map((a, i) => <div key={i} className="punnett-axis">{a}</div>)}
          {ax1.map((a, i) => (
            <React.Fragment key={i}>
              <div className="punnett-axis">{a}</div>
              {ax2.map((b, j) => {
                const sorted = [a, b].sort().join("");
                const riskCount = sorted.split("").filter(x => x === p.riskAllele).length;
                const cls = riskCount === 2 ? "is-risk-double" : riskCount === 1 ? "is-risk" : "";
                return <div key={j} className={`punnett-cell ${cls}`}>{sorted}</div>;
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Probabilities */}
        <div className="probs">
          <Prob label="≥ 1 risk allele" pct={p.probAny * 100} tone="accent" />
          <Prob label="Homozygous risk" pct={(p.homCount / 4) * 100} tone="high" />
        </div>
      </div>

      <style>{`
        .punnett-card {
          display: grid;
          grid-template-columns: 80px 1fr 280px;
          background: var(--bg-raised);
          border: 1px solid var(--line);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        @media (max-width: 920px) {
          .punnett-card { grid-template-columns: 1fr; }
        }
        .punnett-side {
          background: var(--bg-sunk);
          border-right: 1px solid var(--line);
          padding: 22px 14px;
          display: flex; flex-direction: column;
        }
        .punnett-main {
          padding: 22px 24px;
        }
        .cross {
          display: grid;
          grid-template-columns: 1fr 32px 1fr;
          gap: 8px;
          align-items: stretch;
        }
        .cross-op {
          font-size: 30px;
          text-align: center;
          color: var(--fg-dim);
          align-self: center;
        }
        .punnett-viz {
          padding: 22px 24px;
          background: var(--bg-sunk);
          border-left: 1px solid var(--line);
          display: flex; flex-direction: column;
        }
        .punnett-viz .punnett {
          width: 100%;
          max-width: 200px;
          margin: 0 auto;
        }
        .probs { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
      `}</style>
    </article>
  );
}

function ParentBlock({ label, geno, riskAllele }) {
  return (
    <div style={{
      border: "1px solid var(--line)",
      borderRadius: 6,
      padding: "12px 14px",
      background: "var(--bg-sunk)",
    }}>
      <div className="label" style={{ marginBottom: 6 }}>{label}</div>
      <div className="geno" style={{ fontSize: 20 }}>
        {geno.split("").map((ch, i) => (
          <span key={i} className={ch === riskAllele ? "risk-char" : ""}>{ch}</span>
        ))}
      </div>
      <div className="font-mono dim" style={{ fontSize: 10.5, marginTop: 4 }}>
        {geno.split("").every(c => c === geno[0]) ? "homozygous" : "heterozygous"}
      </div>
    </div>
  );
}

function Prob({ label, pct, tone }) {
  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", fontSize: 11.5 }}>
        <span className="dim">{label}</span>
        <span className="font-mono" style={{ fontWeight: 500 }}>{Math.round(pct)}%</span>
      </div>
      <div className="magbar thick" style={{ marginTop: 5 }}>
        <i style={{
          width: `${pct}%`,
          background: tone === "high" ? "var(--high)" : "var(--accent)"
        }} />
      </div>
    </div>
  );
}

window.Offspring = Offspring;
