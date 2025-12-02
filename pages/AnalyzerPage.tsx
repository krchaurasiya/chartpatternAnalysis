import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import ResultCard from '../components/ResultCard';
import LiveMarketWidget from '../components/LiveMarketWidget';
import DailyStockList from '../components/DailyStockList';
import ChartAnnotator from '../components/ChartAnnotator';
import { analyzeChartImage } from '../services/geminiService';
import { AnalysisStatus, ChartAnalysisResult } from '../types';
import { AlertCircle } from 'lucide-react';

const AnalyzerPage: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<ChartAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const handleImageUploaded = (base64: string) => {
    setUploadedImage(base64);
    setIsAnnotating(true);
    setResult(null);
    setError(null);
  };

  const handleAnnotationConfirmed = async (finalImageBase64: string) => {
    setIsAnnotating(false);
    setStatus(AnalysisStatus.ANALYZING);
    
    try {
      const analysis = await analyzeChartImage(finalImageBase64);
      // Attach the image used for analysis to the result
      setResult({ ...analysis, imageUrl: finalImageBase64 });
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleAnnotationCancelled = () => {
    setIsAnnotating(false);
    setUploadedImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Analysis Column */}
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            AI Technical Analysis
          </h1>
          <p className="text-lg text-gray-400">
            Upload a chart, annotate key areas, and let our AI identify patterns and trends.
          </p>
        </div>

        {/* View Switching Logic */}
        {!isAnnotating && !result && status !== AnalysisStatus.ANALYZING && (
          <Dropzone 
            onImageSelected={handleImageUploaded} 
            isLoading={status === AnalysisStatus.ANALYZING} 
          />
        )}

        {isAnnotating && uploadedImage && (
          <ChartAnnotator 
            imageBase64={uploadedImage}
            onConfirm={handleAnnotationConfirmed}
            onCancel={handleAnnotationCancelled}
          />
        )}

        {status === AnalysisStatus.ANALYZING && (
          <div className="h-64 border border-market-border rounded-xl bg-market-card flex items-center justify-center">
             <div className="text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-400 font-medium">Analyzing Patterns...</p>
                <p className="text-gray-500 text-xs mt-2">Connecting to Gemini Vision API</p>
             </div>
          </div>
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && result && (
          <div className="space-y-6">
            <ResultCard result={result} />
            <div className="flex justify-center">
               <button 
                 onClick={() => { setResult(null); setUploadedImage(null); setStatus(AnalysisStatus.IDLE); }}
                 className="text-gray-400 hover:text-white text-sm underline"
               >
                 Analyze Another Chart
               </button>
            </div>
          </div>
        )}
        
        {status === AnalysisStatus.IDLE && !isAnnotating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-12 opacity-50">
              <div className="p-4 border border-market-border rounded-lg">
                  <div className="text-market-green font-mono text-xs mb-2">01</div>
                  <h3 className="text-white font-medium">Annotate Chart</h3>
              </div>
              <div className="p-4 border border-market-border rounded-lg">
                  <div className="text-blue-400 font-mono text-xs mb-2">02</div>
                  <h3 className="text-white font-medium">AI Analysis</h3>
              </div>
              <div className="p-4 border border-market-border rounded-lg">
                  <div className="text-purple-400 font-mono text-xs mb-2">03</div>
                  <h3 className="text-white font-medium">Get Advice</h3>
              </div>
          </div>
        )}
      </div>

      {/* Sidebar / Widget Column */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 space-y-6">
          <LiveMarketWidget />
          <DailyStockList />
          
          <div className="p-4 border border-market-border rounded-xl bg-market-dark/50">
             <h4 className="text-white font-bold text-sm mb-2">Quick Tips</h4>
             <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
               <li>Draw lines to help the AI focus on specific trends.</li>
               <li>Use the currency selector to view prices in INR or USD.</li>
               <li>Check the "Tradable Today" list to see market status.</li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;
