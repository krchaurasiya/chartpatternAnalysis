import React, { useState, useEffect, useRef } from 'react';
import { Activity, ArrowUp, ArrowDown, Wifi, WifiOff, Search, DollarSign } from 'lucide-react';
import { MarketData } from '../types';

const LiveMarketWidget: React.FC = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [mode, setMode] = useState<'CRYPTO' | 'STOCK'>('CRYPTO');
  const [data, setData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputVal, setInputVal] = useState('BTCUSDT');
  
  const wsRef = useRef<WebSocket | null>(null);
  const stockIntervalRef = useRef<number | null>(null);

  // Initial connection
  useEffect(() => {
    connectFeed(symbol, mode);
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (stockIntervalRef.current) {
      clearInterval(stockIntervalRef.current);
      stockIntervalRef.current = null;
    }
    setIsConnected(false);
  };

  const connectFeed = (sym: string, currentMode: 'CRYPTO' | 'STOCK') => {
    cleanup();
    setData(null);

    if (currentMode === 'CRYPTO') {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${sym.toLowerCase()}@miniTicker`);
      
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // Binance miniTicker payload: e: event, E: time, s: symbol, c: close, o: open, h: high, l: low, v: volume, q: quote volume
        const currentPrice = parseFloat(msg.c);
        const openPrice = parseFloat(msg.o);
        const change = ((currentPrice - openPrice) / openPrice) * 100;
        
        setData({
          symbol: msg.s,
          price: currentPrice,
          changePercent: change,
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          volume: parseFloat(msg.v),
          isUp: currentPrice >= openPrice
        });
      };

      wsRef.current = ws;
    } else {
      // Simulation for stocks (Mock Data)
      setIsConnected(true);
      const basePrice = (Math.random() * 100) + 50;
      let currentPrice = basePrice;
      
      const updateStock = () => {
        const change = (Math.random() - 0.5) * 0.5; // Random volatility
        currentPrice += change;
        const openPrice = basePrice;
        const percent = ((currentPrice - openPrice) / openPrice) * 100;
        
        setData({
          symbol: sym.toUpperCase(),
          price: currentPrice,
          changePercent: percent,
          high: currentPrice + 2,
          low: currentPrice - 2,
          volume: Math.floor(Math.random() * 1000000),
          isUp: percent >= 0
        });
      };
      
      updateStock();
      stockIntervalRef.current = window.setInterval(updateStock, 1000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setSymbol(inputVal.toUpperCase());
    connectFeed(inputVal.toUpperCase(), mode);
  };

  return (
    <div className="bg-market-card border border-market-border rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-market-border bg-market-dark/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Live Market
          </h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="flex items-center gap-1 text-[10px] uppercase font-mono text-market-green bg-market-green/10 px-2 py-0.5 rounded-full border border-market-green/20">
                <Wifi className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] uppercase font-mono text-market-red bg-market-red/10 px-2 py-0.5 rounded-full border border-market-red/20">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
          </div>
        </div>

        {/* Search & Toggle */}
        <div className="flex flex-col gap-3">
          <div className="flex p-1 bg-market-dark rounded-lg border border-market-border">
            <button
              onClick={() => { setMode('CRYPTO'); setInputVal('BTCUSDT'); setSymbol('BTCUSDT'); connectFeed('BTCUSDT', 'CRYPTO'); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'CRYPTO' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Crypto
            </button>
            <button
              onClick={() => { setMode('STOCK'); setInputVal('AAPL'); setSymbol('AAPL'); connectFeed('AAPL', 'STOCK'); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'STOCK' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Stocks
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={mode === 'CRYPTO' ? "Pair (e.g. ETHUSDT)" : "Ticker (e.g. TSLA)"}
              className="w-full bg-market-dark border border-market-border rounded-lg py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono uppercase"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Ticker Display */}
      <div className="flex-grow p-6 flex flex-col justify-center">
        {data ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div>
              <div className="text-gray-500 text-sm font-mono mb-1">Last Price</div>
              <div className={`text-4xl font-mono font-bold tracking-tighter flex items-center gap-2 ${
                data.isUp ? 'text-market-green' : 'text-market-red'
              }`}>
                {mode === 'STOCK' ? '$' : ''}{data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-market-dark p-3 rounded-lg border border-market-border">
                <div className="text-gray-500 text-xs font-mono uppercase mb-1">24h Change</div>
                <div className={`flex items-center gap-1 font-mono font-bold ${data.isUp ? 'text-market-green' : 'text-market-red'}`}>
                   {data.isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                   {Math.abs(data.changePercent).toFixed(2)}%
                </div>
              </div>
              <div className="bg-market-dark p-3 rounded-lg border border-market-border">
                <div className="text-gray-500 text-xs font-mono uppercase mb-1">Volume</div>
                <div className="text-white font-mono font-bold">
                   {data.volume.toLocaleString(undefined, { notation: "compact" })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
               <div className="flex justify-between border-b border-market-border pb-1">
                 <span className="text-gray-500">High</span>
                 <span className="text-gray-300">{data.high.toLocaleString()}</span>
               </div>
               <div className="flex justify-between border-b border-market-border pb-1">
                 <span className="text-gray-500">Low</span>
                 <span className="text-gray-300">{data.low.toLocaleString()}</span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
            <DollarSign className="w-12 h-12" />
            <p className="text-sm">Waiting for feed data...</p>
          </div>
        )}
      </div>
      
      <div className="bg-market-dark/30 p-2 text-center border-t border-market-border">
        <p className="text-[10px] text-gray-600">
          {mode === 'CRYPTO' ? 'Real-time data via Binance WebSocket' : 'Demo Mode: Simulated Stock Data'}
        </p>
      </div>
    </div>
  );
};

export default LiveMarketWidget;
