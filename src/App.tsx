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
      await new Promise(r => setTimeout(r, 600)); // Slight delay for UX
      const result = await parseDNAFile(file);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Unable to process file. Please confirm it is a valid raw DNA format (TXT or CSV).");
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
      await new Promise(r => setTimeout(r, 600));
      const result = await parseDNAFile(file);
      if (parentNum === 1) {
        setParent1Data(result);
      } else {
        setParent2Data(result);
      }
    } catch (err) {
      console.error(err);
      setError(`Error processing file for Parent ${parentNum}.`);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                GeneticRisk Platform
              </h1>
              <p className="text-sm text-slate-500">
                Secure & Confidential Genetic Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => { setMode('individual'); resetAll(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'individual'
                    ? 'bg-slate-100 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                Individual Analysis
              </button>
              <button
                onClick={() => { setMode('baby'); resetAll(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'baby'
                    ? 'bg-slate-100 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                Offspring Prediction
              </button>
            </div>
            {hasData && (
              <button
                onClick={resetAll}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Data
              </button>
            )}
          </div>
        </header>

        {/* Individual Mode */}
        {mode === 'individual' && !data && (
          <div className="animate-fade-in-up">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Import Genetic Data
                </h2>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                  Select your raw DNA file to begin analysis. We support standard formats from 23andMe, AncestryDNA, and MyHeritage.
                </p>

                <div className="relative group cursor-pointer mb-8">
                   <div className="absolute inset-0 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 group-hover:border-blue-400 transition-colors pointer-events-none"></div>
                   <input
                    type="file"
                    onChange={handleFileUpload}
                    className="relative z-10 w-full h-32 opacity-0 cursor-pointer"
                    accept=".txt,.csv,.zip"
                   />
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                       Click to browse or drag file here
                     </span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-sm text-slate-900">Client-Side Processing</h4>
                      <p className="text-xs text-slate-500 mt-1">Data never leaves your browser.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-sm text-slate-900">Privacy First</h4>
                      <p className="text-xs text-slate-500 mt-1">No data uploads or storage.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <svg className="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-sm text-slate-900">Detailed Reports</h4>
                      <p className="text-xs text-slate-500 mt-1">Comprehensive risk analysis.</p>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 text-sm font-medium">
                      Processing genomic data...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 text-sm text-left">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Baby Mode - Dual Upload */}
        {mode === 'baby' && !(parent1Data && parent2Data) && (
          <div className="animate-fade-in-up">
             <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Offspring Risk Calculator</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                      Predict potential genetic traits in future offspring by analyzing inheritance patterns from both parents.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Parent 1 */}
                    <div className={`p-6 rounded-xl border-2 transition-all ${parent1Data ? 'border-green-200 bg-green-50' : 'border-dashed border-slate-200 bg-slate-50'}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${parent1Data ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                           <span className="text-xl font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">Parent 1 (Father)</h3>
                        
                        {parent1Data ? (
                          <div className="mt-4 w-full">
                            <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium bg-green-100 py-2 rounded-lg mb-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              File Loaded
                            </div>
                            <p className="text-xs text-green-600">{parent1Data.snps.length.toLocaleString()} markers found</p>
                            <button onClick={() => setParent1Data(null)} className="mt-3 text-xs text-red-500 hover:text-red-700 hover:underline">
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <div className="w-full mt-4">
                            <label className="btn-primary w-full block cursor-pointer text-center py-2 text-sm">
                              {loadingParent === 1 ? 'Processing...' : 'Select File'}
                              <input type="file" onChange={(e) => handleParentUpload(1, e)} className="hidden" accept=".txt,.csv,.zip" />
                            </label>
                            <p className="text-xs text-slate-400 mt-2">Supports raw data formats</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Parent 2 */}
                    <div className={`p-6 rounded-xl border-2 transition-all ${parent2Data ? 'border-green-200 bg-green-50' : 'border-dashed border-slate-200 bg-slate-50'}`}>
                      <div className="flex flex-col items-center text-center">
                         <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${parent2Data ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                           <span className="text-xl font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">Parent 2 (Mother)</h3>
                        
                        {parent2Data ? (
                          <div className="mt-4 w-full">
                            <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium bg-green-100 py-2 rounded-lg mb-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              File Loaded
                            </div>
                            <p className="text-xs text-green-600">{parent2Data.snps.length.toLocaleString()} markers found</p>
                            <button onClick={() => setParent2Data(null)} className="mt-3 text-xs text-red-500 hover:text-red-700 hover:underline">
                              Remove File
                            </button>
                          </div>
                        ) : (
                           <div className="w-full mt-4">
                            <label className="btn-primary w-full block cursor-pointer text-center py-2 text-sm">
                              {loadingParent === 2 ? 'Processing...' : 'Select File'}
                              <input type="file" onChange={(e) => handleParentUpload(2, e)} className="hidden" accept=".txt,.csv,.zip" />
                            </label>
                            <p className="text-xs text-slate-400 mt-2">Supports raw data formats</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                   {error && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm text-center">
                      {error}
                    </div>
                  )}
                </div>
             </div>
          </div>
        )}

        {/* Individual Mode - Results */}
        {mode === 'individual' && data && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Provider</span>
                    <span className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">
                      {data.meta.source}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Total Variants</span>
                    <span className="text-lg font-bold text-blue-600">
                      {data.meta.totalSNPs.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Analysis Date</span>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(data.meta.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <GenomeBrowser snps={data.snps} />
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              <RiskReport snps={data.snps} />
            </div>
          </div>
        )}

        {/* Baby Mode - Results */}
        {mode === 'baby' && parent1Data && parent2Data && (
          <div className="animate-fade-in-up">
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