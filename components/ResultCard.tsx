import React from 'react';
import { ChartAnalysisResult } from '../types';
import { TrendingUp, TrendingDown, Minus, ShieldCheck, Target, AlertTriangle, ImageIcon } from 'lucide-react';

interface ResultCardProps {
  result: ChartAnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend.toUpperCase()) {
      case 'BULLISH': return <TrendingUp className="w-6 h-6 text-market-green" />;
      case 'BEARISH': return <TrendingDown className="w-6 h-6 text-market-red" />;
      default: return <Minus className="w-6 h-6 text-gray-400" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-market-green';
    if (score >= 50) return 'text-yellow-400';
    return 'text-market-red';
  };

  return (
    <div className="w-full bg-market-card border border-market-border rounded-xl overflow-hidden shadow-2xl animate-fade-in space-y-0">
      {/* Header */}
      <div className="p-6 border-b border-market-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-market-card to-market-dark">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {result.patternName}
          </h2>
          <p className="text-gray-400 text-sm mt-1">AI Recognized Pattern</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-mono">Confidence</p>
            <p className={`text-xl font-bold font-mono ${getConfidenceColor(result.confidence)}`}>
              {result.confidence}%
            </p>
          </div>
          <div className="h-8 w-px bg-market-border"></div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-mono">Trend</p>
            <div className="flex items-center justify-end gap-1">
              {getTrendIcon(result.trend)}
              <span className="font-bold text-white">{result.trend}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Image (if exists) + Levels */}
        <div className="p-6 border-r border-market-border space-y-6">
           {result.imageUrl && (
             <div className="mb-6 rounded-lg overflow-hidden border border-market-border bg-black/40">
                <div className="text-xs text-gray-500 p-2 border-b border-market-border flex items-center gap-2">
                   <ImageIcon className="w-3 h-3" /> Analyzed Image with Annotations
                </div>
                <img src={result.imageUrl} alt="Analyzed Chart" className="w-full h-auto object-contain" />
             </div>
           )}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-market-green uppercase tracking-wider mb-2 flex items-center gap-2">
                  Support Levels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.supportLevels.length > 0 ? (
                    result.supportLevels.map((level, idx) => (
                      <span key={idx} className="bg-market-green/10 text-market-green px-3 py-1 rounded-md text-sm font-mono border border-market-green/20">
                        {level}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">None identified</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-market-red uppercase tracking-wider mb-2 flex items-center gap-2">
                   Resistance Levels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.resistanceLevels.length > 0 ? (
                    result.resistanceLevels.map((level, idx) => (
                      <span key={idx} className="bg-market-red/10 text-market-red px-3 py-1 rounded-md text-sm font-mono border border-market-red/20">
                        {level}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm italic">None identified</span>
                  )}
                </div>
              </div>
            </div>
        </div>

        {/* Right Column: Text Analysis */}
        <div className="p-6 space-y-6 bg-market-card/50">
          <div>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Technical Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {result.analysis}
            </p>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" /> Actionable Advice
            </h3>
            <p className="text-white font-medium text-sm">
              {result.actionableAdvice}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-market-border">
             <div className="flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
               <p className="text-xs text-gray-500">
                 Disclaimer: AI analysis is for informational purposes only and does not constitute financial advice. Always perform your own due diligence before trading.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
