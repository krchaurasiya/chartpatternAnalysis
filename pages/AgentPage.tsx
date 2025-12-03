import React, { useState } from 'react';
import { Cpu, Brain, Zap, Target, AlertTriangle, Shield, TrendingUp, Activity, Crosshair, History, Calendar, Play, BarChart } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import { consultRLAgent } from '../services/geminiService';
import { RLDecision, AnalysisStatus } from '../types';

const AgentPage: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [decision, setDecision] = useState<RLDecision | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [marketContext, setMarketContext] = useState('');

  // Backtest State
  const [backtestParams, setBacktestParams] = useState({
    capital: 10000,
    startDate: '',
    endDate: ''
  });
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestMetrics, setBacktestMetrics] = useState<{
    totalPL: number;
    winRate: number;
    sharpeRatio: number;
    trades: number;
    equity: number[];
    maxDrawdown: number;
  } | null>(null);

  const handleAnalysis = async (base64: string) => {
    setImage(base64);
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const result = await consultRLAgent(base64, marketContext || "Standard market conditions");
      setDecision(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (e) {
      console.error(e);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const runBacktest = () => {
    if (!backtestParams.startDate || !backtestParams.endDate) return;
    setIsBacktesting(true);
    setBacktestMetrics(null);

    // Simulate Processing Delay
    setTimeout(() => {
      // Generate realistic simulation data
      const randomSeed = Math.random();
      const isProfitable = randomSeed > 0.3; // 70% chance of profit for demo
      
      const winRate = isProfitable ? (55 + Math.random() * 20) : (30 + Math.random() * 20);
      const profitPercent = isProfitable ? (Math.random() * 0.5) : -(Math.random() * 0.2);
      const totalPL = backtestParams.capital * profitPercent;
      
      // Generate Equity Curve
      const points = [backtestParams.capital];
      let current = backtestParams.capital;
      const steps = 20;
      for (let i = 0; i < steps; i++) {
         const move = (Math.random() - 0.45) * (backtestParams.capital * 0.05); // Random walk with slight upward bias if profitable
         current += isProfitable ? move + (backtestParams.capital * 0.01) : move - (backtestParams.capital * 0.005);
         points.push(current);
      }

      setBacktestMetrics({
        totalPL,
        winRate: parseFloat(winRate.toFixed(1)),
        sharpeRatio: parseFloat((isProfitable ? 1.5 + Math.random() : 0.5 + Math.random()).toFixed(2)),
        trades: Math.floor(Math.random() * 100) + 20,
        equity: points,
        maxDrawdown: parseFloat((Math.random() * 15 + 5).toFixed(1))
      });
      setIsBacktesting(false);
    }, 2000);
  };

  // Helper for Equity Curve SVG
  const renderEquityCurve = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 100;
    const width = 300;
    
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <polyline
          fill="none"
          stroke={data[data.length-1] >= data[0] ? '#00C805' : '#FF5000'}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        {/* Fill area */}
        <polyline
          fill={data[data.length-1] >= data[0] ? 'rgba(0, 200, 5, 0.1)' : 'rgba(255, 80, 0, 0.1)'}
          stroke="none"
          points={`${points} ${width},${height} 0,${height}`}
        />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-market-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Cpu className="w-8 h-8 text-blue-500" />
            RL Trading Agent <span className="text-xs align-top bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">v2.5 (Simulated)</span>
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">
            Upload a live chart screenshot. The agent utilizes a simulated Deep Q-Network to evaluate the state space and output an optimal policy action.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-market-card p-3 rounded-xl border border-market-border">
           <div className="text-right">
             <div className="text-[10px] text-gray-500 uppercase font-bold">Agent Status</div>
             <div className="text-green-400 font-mono text-xs flex items-center justify-end gap-1">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               Online
             </div>
           </div>
           <div className="h-8 w-px bg-market-border"></div>
           <div className="text-right">
             <div className="text-[10px] text-gray-500 uppercase font-bold">Reward Score</div>
             <div className="text-blue-400 font-mono text-xs">+1,240.50</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-market-card border border-market-border rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" /> Market Input
            </h3>
            
            {!image ? (
              <Dropzone onImageSelected={handleAnalysis} isLoading={status === AnalysisStatus.ANALYZING} />
            ) : (
              <div className="relative group">
                <img src={image} alt="Input State" className="w-full rounded-lg border border-market-border opacity-80" />
                <button 
                  onClick={() => { setImage(null); setDecision(null); setStatus(AnalysisStatus.IDLE); }}
                  className="absolute top-2 right-2 bg-black/80 text-white text-xs px-3 py-1 rounded hover:bg-red-500 transition-colors"
                >
                  Reset State
                </button>
              </div>
            )}
            
            <div className="mt-4">
              <label className="text-xs text-gray-400 font-bold uppercase block mb-2">Optional Context (Indicators/News)</label>
              <textarea 
                className="w-full bg-market-dark border border-market-border rounded-lg p-3 text-sm text-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="e.g. RSI is overbought at 75, Fed meeting today..."
                rows={3}
                value={marketContext}
                onChange={(e) => setMarketContext(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
             <h4 className="text-blue-400 text-xs font-bold uppercase mb-2 flex items-center gap-2">
               <Brain className="w-4 h-4" /> How it works
             </h4>
             <p className="text-gray-400 text-xs leading-relaxed">
               The agent perceives the chart image as the "State". It passes this through a Vision Transformer (ViT) backbone (via Gemini) to extract features. These features are fed into a simulated Policy Network which outputs probabilities for Buy, Sell, or Hold actions based on historical reward maximization.
             </p>
          </div>
        </div>

        {/* Right Column: Output / Dashboard */}
        <div className="lg:col-span-7">
          {status === AnalysisStatus.ANALYZING && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-market-card border border-market-border rounded-xl">
               <Cpu className="w-16 h-16 text-blue-500 animate-pulse mb-6" />
               <h3 className="text-xl font-bold text-white mb-2">Calculating Q-Values...</h3>
               <div className="w-64 bg-market-dark rounded-full h-2 mb-2 overflow-hidden">
                 <div className="bg-blue-500 h-full animate-[width_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
               </div>
               <p className="text-gray-500 text-xs font-mono">Running Inference on Tensor Units</p>
            </div>
          )}

          {status === AnalysisStatus.ERROR && (
             <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
               <AlertTriangle /> Failed to compute policy. Please try a clearer chart image.
             </div>
          )}

          {status === AnalysisStatus.IDLE && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-market-border rounded-xl text-gray-600">
               <Target className="w-12 h-12 mb-4 opacity-50" />
               <p>Waiting for State Input...</p>
            </div>
          )}

          {status === AnalysisStatus.COMPLETED && decision && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              
              {/* Main Decision Banner */}
              <div className="grid grid-cols-2 gap-4">
                 <div className={`col-span-2 md:col-span-1 p-6 rounded-xl border flex flex-col justify-between h-40 ${
                   decision.action === 'BUY' ? 'bg-market-green/10 border-market-green text-market-green' :
                   decision.action === 'SELL' ? 'bg-market-red/10 border-market-red text-market-red' :
                   'bg-gray-500/10 border-gray-500 text-gray-300'
                 }`}>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-75">Optimal Policy</div>
                    <div className="text-5xl font-black tracking-tighter">{decision.action}</div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Zap className="w-4 h-4 fill-current" /> Strong Signal
                    </div>
                 </div>

                 <div className="col-span-2 md:col-span-1 grid grid-rows-2 gap-4">
                    <div className="bg-market-card border border-market-border rounded-xl p-4 flex items-center justify-between">
                       <div>
                         <div className="text-gray-500 text-xs uppercase font-bold">Confidence (Q)</div>
                         <div className="text-2xl font-mono font-bold text-white">{decision.confidence}%</div>
                       </div>
                       <div className="h-10 w-10 rounded-full border-4 border-market-border flex items-center justify-center text-[10px] text-gray-400" style={{
                         borderColor: decision.confidence > 70 ? '#00C805' : '#30363d'
                       }}>
                         Q
                       </div>
                    </div>
                    <div className="bg-market-card border border-market-border rounded-xl p-4 flex items-center justify-between">
                       <div>
                         <div className="text-gray-500 text-xs uppercase font-bold">Reward/Risk</div>
                         <div className="text-2xl font-mono font-bold text-white">{decision.rewardRiskRatio}:1</div>
                       </div>
                       <TrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                 </div>
              </div>

              {/* Trade Parameters */}
              <div className="bg-market-card border border-market-border rounded-xl overflow-hidden">
                <div className="px-6 py-3 bg-market-dark/50 border-b border-market-border flex items-center justify-between">
                   <h3 className="text-white font-bold text-sm flex items-center gap-2">
                     <Crosshair className="w-4 h-4 text-blue-400" /> Execution Parameters
                   </h3>
                </div>
                <div className="grid grid-cols-3 divide-x divide-market-border">
                   <div className="p-4 text-center">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">Entry Zone</div>
                      <div className="text-white font-mono font-bold">{decision.suggestedEntry}</div>
                   </div>
                   <div className="p-4 text-center">
                      <div className="text-[10px] text-red-500 uppercase mb-1">Stop Loss</div>
                      <div className="text-red-400 font-mono font-bold">{decision.stopLoss}</div>
                   </div>
                   <div className="p-4 text-center">
                      <div className="text-[10px] text-green-500 uppercase mb-1">Take Profit</div>
                      <div className="text-green-400 font-mono font-bold">{decision.takeProfit}</div>
                   </div>
                </div>
              </div>

              {/* Logic/State */}
              <div className="bg-market-card border border-market-border rounded-xl p-6 space-y-4">
                 <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                   <Shield className="w-4 h-4 text-purple-400" /> Agent Reasoning
                 </h3>
                 <p className="text-gray-300 text-sm leading-relaxed">
                   {decision.reasoning}
                 </p>
                 
                 <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-market-dark p-2 rounded border border-market-border">
                      <div className="text-[10px] text-gray-500">Detected Trend</div>
                      <div className="text-white text-xs font-bold truncate">{decision.detectedState.trend}</div>
                    </div>
                    <div className="bg-market-dark p-2 rounded border border-market-border">
                      <div className="text-[10px] text-gray-500">Volatility</div>
                      <div className="text-white text-xs font-bold truncate">{decision.detectedState.volatility}</div>
                    </div>
                    <div className="bg-market-dark p-2 rounded border border-market-border">
                      <div className="text-[10px] text-gray-500">Structure</div>
                      <div className="text-white text-xs font-bold truncate">{decision.detectedState.keyLevels}</div>
                    </div>
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Backtesting Simulator Section */}
      <div className="border-t border-market-border pt-8 mt-8 animate-in fade-in slide-in-from-bottom-6">
         <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
           <History className="w-6 h-6 text-purple-500" /> 
           Historical Backtest Simulator
         </h2>
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Simulator Controls */}
           <div className="lg:col-span-4 bg-market-card border border-market-border rounded-xl p-6 h-fit">
              <h3 className="text-sm font-bold text-gray-300 uppercase mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Starting Capital ($)</label>
                  <input 
                    type="number" 
                    value={backtestParams.capital}
                    onChange={(e) => setBacktestParams({...backtestParams, capital: parseInt(e.target.value) || 0})}
                    className="w-full bg-market-dark border border-market-border rounded-lg p-2 text-white font-mono focus:border-purple-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">Start Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={backtestParams.startDate}
                        onChange={(e) => setBacktestParams({...backtestParams, startDate: e.target.value})}
                        className="w-full bg-market-dark border border-market-border rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none appearance-none"
                      />
                      <Calendar className="w-3 h-3 text-gray-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">End Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={backtestParams.endDate}
                        onChange={(e) => setBacktestParams({...backtestParams, endDate: e.target.value})}
                        className="w-full bg-market-dark border border-market-border rounded-lg p-2 text-white text-xs focus:border-purple-500 outline-none"
                      />
                       <Calendar className="w-3 h-3 text-gray-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={runBacktest}
                  disabled={isBacktesting || !backtestParams.startDate || !backtestParams.endDate}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                    ${isBacktesting 
                      ? 'bg-purple-500/50 cursor-not-allowed text-gray-300' 
                      : (!backtestParams.startDate || !backtestParams.endDate) 
                        ? 'bg-market-border text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                    }`}
                >
                  {isBacktesting ? (
                    <>Running Simulation...</>
                  ) : (
                    <><Play className="w-4 h-4 fill-current" /> Run Backtest</>
                  )}
                </button>
              </div>
           </div>

           {/* Simulator Results */}
           <div className="lg:col-span-8 bg-market-card border border-market-border rounded-xl p-6 min-h-[300px] flex flex-col relative overflow-hidden">
              {!backtestMetrics ? (
                 <div className="flex-grow flex flex-col items-center justify-center text-gray-600 space-y-4">
                    <BarChart className="w-16 h-16 opacity-20" />
                    <p className="text-sm font-medium">Select parameters and run simulation to view performance metrics</p>
                 </div>
              ) : (
                 <div className="space-y-6 animate-in fade-in">
                    {/* Top Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="p-3 bg-market-dark rounded-lg border border-market-border">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Net Profit</div>
                          <div className={`text-lg font-mono font-bold ${backtestMetrics.totalPL >= 0 ? 'text-market-green' : 'text-market-red'}`}>
                            {backtestMetrics.totalPL >= 0 ? '+' : ''}{backtestMetrics.totalPL.toLocaleString(undefined, {style: 'currency', currency: 'USD'})}
                          </div>
                       </div>
                       <div className="p-3 bg-market-dark rounded-lg border border-market-border">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Win Rate</div>
                          <div className="text-lg font-mono font-bold text-white">{backtestMetrics.winRate}%</div>
                       </div>
                       <div className="p-3 bg-market-dark rounded-lg border border-market-border">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sharpe Ratio</div>
                          <div className="text-lg font-mono font-bold text-blue-400">{backtestMetrics.sharpeRatio}</div>
                       </div>
                       <div className="p-3 bg-market-dark rounded-lg border border-market-border">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Max Drawdown</div>
                          <div className="text-lg font-mono font-bold text-red-400">-{backtestMetrics.maxDrawdown}%</div>
                       </div>
                    </div>

                    {/* Chart Area */}
                    <div className="relative h-48 w-full bg-market-dark/50 border border-market-border rounded-lg p-4">
                       <div className="absolute top-2 left-4 text-xs text-gray-500 font-bold uppercase flex items-center gap-2">
                         <TrendingUp className="w-3 h-3" /> Equity Curve
                       </div>
                       <div className="h-full w-full flex items-end pt-6">
                          {renderEquityCurve(backtestMetrics.equity)}
                       </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 font-mono px-1">
                       <span>{backtestParams.startDate}</span>
                       <span>{backtestMetrics.trades} Trades Executed</span>
                       <span>{backtestParams.endDate}</span>
                    </div>
                 </div>
              )}
           </div>
         </div>
      </div>
    </div>
  );
};

export default AgentPage;