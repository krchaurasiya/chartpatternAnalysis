import React, { useState, useEffect, useRef } from 'react';
import { Activity, ArrowUp, ArrowDown, Wifi, WifiOff, Search, DollarSign, Globe, TrendingUp } from 'lucide-react';
import { MarketData, CurrencyCode, Currency, MarketType } from '../types';

const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: 'USD', symbol: '$', rate: 1 },
  INR: { code: 'INR', symbol: '₹', rate: 84.05 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.93 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

const SIMULATED_STOCKS = {
  'RELIANCE': { base: 2900, vol: 5000000, type: 'STOCK_IN' },
  'TCS': { base: 4100, vol: 2000000, type: 'STOCK_IN' },
  'HDFCBANK': { base: 1450, vol: 8000000, type: 'STOCK_IN' },
  'EURUSD': { base: 1.085, vol: 999999, type: 'FOREX' },
  'GBPUSD': { base: 1.265, vol: 999999, type: 'FOREX' },
  'USDJPY': { base: 151.2, vol: 999999, type: 'FOREX' },
};

const LiveMarketWidget: React.FC = () => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [mode, setMode] = useState<MarketType>('CRYPTO');
  const [data, setData] = useState<MarketData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [inputVal, setInputVal] = useState('BTCUSDT');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  
  const wsRef = useRef<WebSocket | null>(null);
  const simIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    connectFeed(symbol, mode);
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsConnected(false);
  };

  const connectFeed = (sym: string, currentMode: MarketType) => {
    cleanup();
    setData(null);

    if (currentMode === 'CRYPTO') {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${sym.toLowerCase()}@miniTicker`);
      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const price = parseFloat(msg.c);
        const open = parseFloat(msg.o);
        setData({
          symbol: msg.s,
          price: price,
          changePercent: ((price - open) / open) * 100,
          high: parseFloat(msg.h),
          low: parseFloat(msg.l),
          volume: parseFloat(msg.v),
          isUp: price >= open,
          type: 'CRYPTO'
        });
      };
      wsRef.current = ws;
    } else {
      // Simulation for Stocks/Forex
      setIsConnected(true);
      const stockKey = sym.toUpperCase() as keyof typeof SIMULATED_STOCKS;
      const baseData = SIMULATED_STOCKS[stockKey] || { base: 100, vol: 1000, type: currentMode };
      
      let currentPrice = baseData.base;
      const volatility = currentMode === 'FOREX' ? 0.0005 : 0.002;

      const updateSim = () => {
        const change = (Math.random() - 0.5) * (baseData.base * volatility);
        currentPrice += change;
        const openPrice = baseData.base;
        const percent = ((currentPrice - openPrice) / openPrice) * 100;
        
        setData({
          symbol: sym.toUpperCase(),
          price: currentPrice,
          changePercent: percent,
          high: Math.max(currentPrice, baseData.base * 1.01),
          low: Math.min(currentPrice, baseData.base * 0.99),
          volume: baseData.vol + Math.floor(Math.random() * 10000),
          isUp: percent >= 0,
          type: currentMode
        });
      };
      
      updateSim();
      simIntervalRef.current = window.setInterval(updateSim, 2000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const cleanSym = inputVal.toUpperCase().trim();
    setSymbol(cleanSym);
    
    // Auto-detect mode roughly
    let newMode: MarketType = mode;
    if (['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'].includes(cleanSym)) newMode = 'STOCK_IN';
    else if (['EURUSD', 'GBPUSD', 'USDJPY'].includes(cleanSym)) newMode = 'FOREX';
    else if (cleanSym.endsWith('USDT')) newMode = 'CRYPTO';
    
    setMode(newMode);
    connectFeed(cleanSym, newMode);
  };

  const formatPrice = (price: number) => {
    if (mode === 'STOCK_IN' && currency === 'INR') return `₹${price.toLocaleString()}`;
    if (mode === 'STOCK_IN' && currency !== 'INR') return `$${(price / CURRENCIES.INR.rate).toFixed(2)}`;
    
    const selectedCurr = CURRENCIES[currency];
    const convertedPrice = price * (currency === 'USD' ? 1 : selectedCurr.rate);
    
    if (mode === 'FOREX') return convertedPrice.toFixed(5);
    return `${selectedCurr.symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-market-card border border-market-border rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-market-border bg-gradient-to-r from-market-card to-market-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-blue-500" />
            MARKET DATA
          </h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${isConnected ? 'text-market-green border-market-green/20 bg-market-green/10' : 'text-red-500 border-red-500/20 bg-red-500/10'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-market-green animate-pulse' : 'bg-red-500'}`}></div>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
            
            <div className="relative group z-20">
               <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-market-dark border border-market-border px-2 py-0.5 rounded transition-colors">
                  <Globe className="w-3 h-3" /> {currency}
               </button>
               <div className="absolute right-0 top-full mt-1 bg-market-card border border-market-border rounded shadow-xl hidden group-hover:block w-24">
                  {Object.values(CURRENCIES).map((c) => (
                    <button key={c.code} onClick={() => setCurrency(c.code)} className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white">
                      {c.code}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Ticker Display */}
        {data ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mb-4">
             <div className="flex justify-between items-end">
               <span className="text-2xl font-mono font-bold text-white tracking-tight">{formatPrice(data.price)}</span>
               <span className={`font-mono text-sm font-bold flex items-center ${data.isUp ? 'text-market-green' : 'text-market-red'}`}>
                 {data.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                 {Math.abs(data.changePercent).toFixed(2)}%
               </span>
             </div>
             <div className="text-xs text-gray-500 font-mono mt-1 flex justify-between">
                <span>{data.symbol}</span>
                <span>Vol: {data.volume.toLocaleString(undefined, { notation: "compact" })}</span>
             </div>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-gray-600 text-xs animate-pulse">Initializing Feed...</div>
        )}

        {/* Search & Tabs */}
        <div className="space-y-2">
          <div className="flex p-0.5 bg-market-dark rounded-lg border border-market-border">
            {[
              { id: 'CRYPTO', label: 'Crypto' },
              { id: 'STOCK_IN', label: 'NSE' },
              { id: 'FOREX', label: 'Forex' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  const m = tab.id as MarketType;
                  setMode(m);
                  if(m === 'STOCK_IN') { setInputVal('RELIANCE'); setSymbol('RELIANCE'); connectFeed('RELIANCE', m); }
                  else if(m === 'FOREX') { setInputVal('EURUSD'); setSymbol('EURUSD'); connectFeed('EURUSD', m); }
                  else { setInputVal('BTCUSDT'); setSymbol('BTCUSDT'); connectFeed('BTCUSDT', m); }
                }}
                className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                  mode === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-market-dark/50 border border-market-border group-hover:border-blue-500/50 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono uppercase"
              placeholder="SEARCH SYMBOL..."
            />
            <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketWidget;