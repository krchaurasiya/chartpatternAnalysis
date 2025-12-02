import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import ResultCard from '../components/ResultCard';
import { analyzeChartImage } from '../services/geminiService';
import { AnalysisStatus, ChartAnalysisResult } from '../types';
import { AlertCircle } from 'lucide-react';

const AnalyzerPage: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<ChartAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeChartImage(base64);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          AI Technical Analysis
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Upload a screenshot of any stock, crypto, or forex chart. Our AI will identify patterns, key levels, and predict the trend.
        </p>
      </div>

      <Dropzone 
        onImageSelected={handleImageSelected} 
        isLoading={status === AnalysisStatus.ANALYZING} 
      />

      {status === AnalysisStatus.ERROR && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {status === AnalysisStatus.COMPLETED && result && (
        <ResultCard result={result} />
      )}
      
      {/* Sample hint if idle */}
      {status === AnalysisStatus.IDLE && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-12 opacity-50">
            <div className="p-4 border border-market-border rounded-lg">
                <div className="text-market-green font-mono text-xs mb-2">01</div>
                <h3 className="text-white font-medium">Pattern Recognition</h3>
            </div>
            <div className="p-4 border border-market-border rounded-lg">
                <div className="text-blue-400 font-mono text-xs mb-2">02</div>
                <h3 className="text-white font-medium">Support & Resistance</h3>
            </div>
            <div className="p-4 border border-market-border rounded-lg">
                <div className="text-purple-400 font-mono text-xs mb-2">03</div>
                <h3 className="text-white font-medium">Actionable Signals</h3>
            </div>
         </div>
      )}
    </div>
  );
};

export default AnalyzerPage;