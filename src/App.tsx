import { useState } from 'react'
import type { ParseResult } from './utils/DNAParser'
import { parseDNAFile } from './utils/DNAParser'
import RiskReport from './components/RiskReport'
import GenomeBrowser from './components/GenomeBrowser'
import BabyRiskReport from './components/BabyRiskReport'

type AppMode = 'individual' | 'baby';

function App() {
  const [mode, setMode] = useState<AppMode>('individual');
  const [data, setData] = useState<ParseResult | null>(null);
  const [parent1Data, setParent1Data] = useState<ParseResult | null>(null);
  const [parent2Data, setParent2Data] = useState<ParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingParent, setLoadingParent] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(r => setTimeout(r, 100));
      const result = await parseDNAFile(file);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to parse file. Please ensure it's a valid raw DNA file (txt/csv).");
    } finally {
      setLoading(false);
    }
  };

  const handleParentUpload = async (parentNum: 1 | 2, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingParent(parentNum);
    setError(null);

    try {
      await new Promise(r => setTimeout(r, 100));
      const result = await parseDNAFile(file);
      if (parentNum === 1) {
        setParent1Data(result);
      } else {
        setParent2Data(result);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to parse Parent ${parentNum} file.`);
    } finally {
      setLoadingParent(null);
    }
  };

  const loadSampleForParent = async (parentNum: 1 | 2, sampleType: 'myheritage' | '23andme') => {
    setLoadingParent(parentNum);
    try {
      const url = sampleType === 'myheritage' ? '/sample.csv' : '/sample_23andme.txt';
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], `sample_${sampleType}.${sampleType === 'myheritage' ? 'csv' : 'txt'}`, { type: 'text/plain' });
      const result = await parseDNAFile(file);
      if (parentNum === 1) {
        setParent1Data(result);
      } else {
        setParent2Data(result);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to load sample for Parent ${parentNum}.`);
    } finally {
      setLoadingParent(null);
    }
  };

  const resetAll = () => {
    setData(null);
    setParent1Data(null);
    setParent2Data(null);
    setError(null);
  };

  const hasData = mode === 'individual' ? data : (parent1Data && parent2Data);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="glass-card-elevated px-6 py-4 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg glow-accent">
              {mode === 'individual' ? '🧬' : '👶'}
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">
                Antigravity Genetic Analyzer
              </h1>
              <p className="text-sm text-gray-400">
                {mode === 'individual' ? 'Advanced DNA Analysis' : 'Baby Genetic Risk Calculator'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="glass-card p-1 flex gap-1">
              <button
                onClick={() => { setMode('individual'); resetAll(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'individual'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                🧬 Individual
              </button>
              <button
                onClick={() => { setMode('baby'); resetAll(); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'baby'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                👶 Baby Mode
              </button>
            </div>
            {hasData && (
              <button
                onClick={resetAll}
                className="btn-ghost text-sm flex items-center gap-2"
              >
                <span>↺</span> Reset
              </button>
            )}
          </div>
        </header>

        {/* Individual Mode */}
        {mode === 'individual' && !data && (
          <div className="animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
            <div className="glass-card-elevated upload-zone py-20 px-8 flex flex-col items-center justify-center cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".txt,.csv,.zip"
              />

              <div className="text-7xl mb-6 animate-float">🧬</div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Upload Your Raw DNA File
              </h2>
              <p className="text-gray-400 text-center max-w-md">
                Drag & drop or click to upload. Supports 23andMe, AncestryDNA, and MyHeritage formats.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">🔒</span> Client-side only
                </span>
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-blue-400">🚫</span> No data uploads
                </span>
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-purple-400">✓</span> 100% Private
                </span>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoading(true);
                    try {
                      const res = await fetch('/sample.csv');
                      const blob = await res.blob();
                      const file = new File([blob], 'MyHeritage_sample.csv', { type: 'text/csv' });
                      const result = await parseDNAFile(file);
                      setData(result);
                    } catch (err) {
                      console.error(err);
                      setError("Failed to load sample file.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="btn-primary z-10 relative"
                >
                  🧪 Load MyHeritage Sample
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setLoading(true);
                    try {
                      const res = await fetch('/sample_23andme.txt');
                      const blob = await res.blob();
                      const file = new File([blob], '23andMe_sample.txt', { type: 'text/plain' });
                      const result = await parseDNAFile(file);
                      setData(result);
                    } catch (err) {
                      console.error(err);
                      setError("Failed to load sample file.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="btn-ghost border border-white/10 z-10 relative"
                >
                  🧪 Load 23andMe Sample
                </button>
              </div>

              {loading && (
                <div className="mt-10 flex flex-col items-center gap-4">
                  <div className="dna-loader"></div>
                  <p className="text-indigo-400 font-medium animate-pulse">
                    Analyzing genomic data...
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-8 glass-card px-6 py-3 border border-red-500/30 text-red-400">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Baby Mode - Dual Upload */}
        {mode === 'baby' && !(parent1Data && parent2Data) && (
          <div className="animate-fade-in-up delay-100" style={{ animationFillMode: 'both' }}>
            <div className="glass-card-elevated p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">👶</div>
                <h2 className="text-2xl font-bold text-white mb-2">Baby Genetic Risk Calculator</h2>
                <p className="text-gray-400 max-w-xl mx-auto">
                  Upload DNA files from both parents to calculate the probability of genetic conditions in your future child using Mendelian inheritance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent 1 */}
                <div className={`glass-card p-6 rounded-xl border-2 transition-all ${parent1Data ? 'border-green-500/50 bg-green-500/5' : 'border-dashed border-white/20'
                  }`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">👨</div>
                    <h3 className="text-lg font-bold text-white mb-1">Parent 1 (Father)</h3>
                    {parent1Data ? (
                      <div className="space-y-2">
                        <p className="text-green-400 flex items-center justify-center gap-2">
                          <span>✓</span> Loaded: {parent1Data.meta.source}
                        </p>
                        <p className="text-sm text-gray-400">
                          {parent1Data.snps.length.toLocaleString()} SNPs
                        </p>
                        <button
                          onClick={() => setParent1Data(null)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-400 text-sm mb-4">Upload DNA file</p>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => handleParentUpload(1, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".txt,.csv,.zip"
                          />
                          <button className="btn-primary w-full">
                            {loadingParent === 1 ? 'Loading...' : 'Select File'}
                          </button>
                        </div>
                        <div className="mt-3 flex gap-2 justify-center">
                          <button
                            onClick={() => loadSampleForParent(1, 'myheritage')}
                            className="text-xs text-indigo-400 hover:underline"
                          >
                            Load Sample
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parent 2 */}
                <div className={`glass-card p-6 rounded-xl border-2 transition-all ${parent2Data ? 'border-green-500/50 bg-green-500/5' : 'border-dashed border-white/20'
                  }`}>
                  <div className="text-center">
                    <div className="text-5xl mb-3">👩</div>
                    <h3 className="text-lg font-bold text-white mb-1">Parent 2 (Mother)</h3>
                    {parent2Data ? (
                      <div className="space-y-2">
                        <p className="text-green-400 flex items-center justify-center gap-2">
                          <span>✓</span> Loaded: {parent2Data.meta.source}
                        </p>
                        <p className="text-sm text-gray-400">
                          {parent2Data.snps.length.toLocaleString()} SNPs
                        </p>
                        <button
                          onClick={() => setParent2Data(null)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-400 text-sm mb-4">Upload DNA file</p>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={(e) => handleParentUpload(2, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept=".txt,.csv,.zip"
                          />
                          <button className="btn-primary w-full">
                            {loadingParent === 2 ? 'Loading...' : 'Select File'}
                          </button>
                        </div>
                        <div className="mt-3 flex gap-2 justify-center">
                          <button
                            onClick={() => loadSampleForParent(2, '23andme')}
                            className="text-xs text-indigo-400 hover:underline"
                          >
                            Load Sample
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Privacy badges */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-green-400">🔒</span> Client-side only
                </span>
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-pink-400">👶</span> Mendelian Genetics
                </span>
                <span className="glass-card px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
                  <span className="text-purple-400">✓</span> 100% Private
                </span>
              </div>

              {error && (
                <div className="mt-6 glass-card px-6 py-3 border border-red-500/30 text-red-400 text-center">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Individual Mode - Results */}
        {mode === 'individual' && data && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
              <div className="glass-card-elevated p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-400">📊</span> File Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Source</span>
                    <span className="font-semibold text-indigo-400 glass-card px-2 py-0.5 text-xs">
                      {data.meta.source}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total SNPs</span>
                    <span className="font-bold text-white text-lg">
                      {data.meta.totalSNPs.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Processed</span>
                    <span className="font-mono text-xs text-gray-500">
                      {new Date(data.meta.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <GenomeBrowser snps={data.snps} />
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3 animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
              <RiskReport snps={data.snps} />
            </div>
          </div>
        )}

        {/* Baby Mode - Results */}
        {mode === 'baby' && parent1Data && parent2Data && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'both' }}>
            <BabyRiskReport
              parent1Snps={parent1Data.snps}
              parent2Snps={parent2Data.snps}
              parent1Name="Father"
              parent2Name="Mother"
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default App
