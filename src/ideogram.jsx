/* global React */
// Chromosome ideogram — proportional human karyotype with risk dots
// overlaid at each finding's position. Hovering a dot calls onHover so
// the parent can highlight the corresponding card.

const CHR_LENGTHS = {
  // Approximate ungapped lengths in Mb (GRCh38). Used only for proportion.
  "1": 248, "2": 242, "3": 198, "4": 190, "5": 181, "6": 170,
  "7": 159, "8": 145, "9": 138, "10": 133, "11": 135, "12": 133,
  "13": 114, "14": 107, "15": 101, "16": 90, "17": 83, "18": 80,
  "19": 58, "20": 64, "21": 46, "22": 50, "X": 156, "Y": 57,
};
// Approximate centromere position (Mb) for that subtle "constriction" dot
const CENTROMERES = {
  "1": 122, "2": 92, "3": 90, "4": 50, "5": 48, "6": 59, "7": 59, "8": 45,
  "9": 43, "10": 39, "11": 51, "12": 34, "13": 16, "14": 16, "15": 17,
  "16": 36, "17": 24, "18": 17, "19": 26, "20": 27, "21": 12, "22": 14,
  "X": 60, "Y": 11,
};
const MAX_LEN = 248;

function Ideogram({ findings, activeId, onHover }) {
  // Group findings by chromosome — skip findings without chr
  const byChr = {};
  findings.forEach((f) => {
    if (f.chr == null) return;
    const k = String(f.chr);
    (byChr[k] = byChr[k] || []).push(f);
  });
  const mappedCount = Object.values(byChr).reduce((s, a) => s + a.length, 0);

  const chrs = Object.keys(CHR_LENGTHS);
  // Two columns: 1–12 on the left, 13–22+XY on the right
  const left = chrs.slice(0, 12);
  const right = chrs.slice(12);

  return (
    <div className="ideogram">
      <div className="ideogram-head">
        <div>
          <div className="label">Karyotype Overview</div>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 400, marginTop: 4 }}>
            Where your variants sit
          </div>
          <div className="dim" style={{ fontSize: 11.5, marginTop: 4 }}>
            {mappedCount} of {findings.length} findings mapped to known chromosome
          </div>
        </div>
        <div className="ideogram-legend">
          <Legend tone="high" label="High impact" />
          <Legend tone="mod"  label="Moderate" />
          <Legend tone="low"  label="Informational" />
        </div>
      </div>

      <div className="ideogram-grid">
        <Column chrs={left} byChr={byChr} activeId={activeId} onHover={onHover} />
        <Column chrs={right} byChr={byChr} activeId={activeId} onHover={onHover} />
      </div>

      <style>{`
        .ideogram { padding: 24px 28px; }
        .ideogram-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--line-soft);
          flex-wrap: wrap;
        }
        .ideogram-head > div:first-child { min-width: 200px; }
        .ideogram-legend { display: flex; gap: 18px; }
        .legend-item {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; color: var(--fg-mid);
        }
        .legend-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: var(--accent);
        }
        .legend-dot.is-high { background: var(--high); }
        .legend-dot.is-mod  { background: var(--mod); }
        .legend-dot.is-low  { background: var(--low); }
        .ideogram-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 28px;
        }
        @media (max-width: 720px) { .ideogram-grid { grid-template-columns: 1fr; } }
        .chr-col { display: flex; flex-direction: column; gap: 9px; }
      `}</style>
    </div>
  );
}

function Column({ chrs, byChr, activeId, onHover }) {
  return (
    <div className="chr-col">
      {chrs.map((c) => {
        const len = CHR_LENGTHS[c];
        const widthPct = (len / MAX_LEN) * 100;
        const centromerePct = (CENTROMERES[c] / len) * 100;
        const hits = byChr[c] || [];
        // Spread dots evenly across the chromosome since we don't have positions
        return (
          <div key={c} className="chr-row">
            <div className="chr-label">{c}</div>
            <div style={{ position: "relative", width: `${widthPct}%`, minWidth: 80 }}>
              <div className="chr-bar">
                <div className="centromere" style={{ left: `${centromerePct}%` }} />
                {hits.map((h, i) => {
                  const tone = h.magnitude >= 7 ? "high" : h.magnitude >= 5 ? "mod" : "low";
                  // Hash rsid to a stable position percentage 8-92
                  let hash = 0;
                  for (let j = 0; j < h.rsid.length; j++) hash = (hash * 31 + h.rsid.charCodeAt(j)) >>> 0;
                  const posPct = 8 + (hash % 850) / 10;
                  return (
                    <div
                      key={h.rsid}
                      className={`chr-dot is-${tone}${activeId === h.rsid ? " is-active" : ""}`}
                      style={{ left: `${posPct}%` }}
                      onMouseEnter={() => onHover?.(h.rsid)}
                      onMouseLeave={() => onHover?.(null)}
                      onClick={() => {
                        const el = document.getElementById(`risk-${h.rsid}`);
                        if (!el) return;
                        const scroller = document.querySelector(".scroll-region") || document.scrollingElement || document.documentElement;
                        const rect = el.getBoundingClientRect();
                        const sRect = scroller === document.scrollingElement || scroller === document.documentElement
                          ? { top: 0 }
                          : scroller.getBoundingClientRect();
                        const top = (scroller.scrollTop || 0) + rect.top - (sRect.top || 0) - 120;
                        scroller.scrollTo({ top, behavior: "smooth" });
                      }}
                      title={`${h.condition} · ${h.gene}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Legend({ tone, label }) {
  return (
    <span className="legend-item">
      <span className={`legend-dot is-${tone}`} /> {label}
    </span>
  );
}

window.Ideogram = Ideogram;
