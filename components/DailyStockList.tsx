import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface StockItem {
  ticker: string;
  name: string;
  type: 'STOCK' | 'CRYPTO';
  region: 'US' | 'IN' | 'GLOBAL';
}

const STOCK_DB: StockItem[] = [
  { ticker: 'BTC', name: 'Bitcoin', type: 'CRYPTO', region: 'GLOBAL' },
  { ticker: 'ETH', name: 'Ethereum', type: 'CRYPTO', region: 'GLOBAL' },
  { ticker: 'SOL', name: 'Solana', type: 'CRYPTO', region: 'GLOBAL' },
  { ticker: 'RELIANCE', name: 'Reliance Ind.', type: 'STOCK', region: 'IN' },
  { ticker: 'TCS', name: 'Tata Consultancy', type: 'STOCK', region: 'IN' },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', type: 'STOCK', region: 'IN' },
  { ticker: 'INFY', name: 'Infosys', type: 'STOCK', region: 'IN' },
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'STOCK', region: 'US' },
  { ticker: 'TSLA', name: 'Tesla Inc.', type: 'STOCK', region: 'US' },
  { ticker: 'NVDA', name: 'Nvidia Corp.', type: 'STOCK', region: 'US' },
  { ticker: 'MSFT', name: 'Microsoft', type: 'STOCK', region: 'US' },
];

const DailyStockList: React.FC = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  const isWeekend = day === 0 || day === 6;

  // Filter logic: Crypto always open. Stocks closed on weekend.
  const tradableAssets = STOCK_DB.map(stock => {
    let isOpen = true;
    let status = 'Market Open';
    
    if (stock.type === 'STOCK' && isWeekend) {
      isOpen = false;
      status = 'Weekend Close';
    }

    return { ...stock, isOpen, status };
  }).sort((a, b) => (a.isOpen === b.isOpen ? 0 : a.isOpen ? -1 : 1));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-market-card border border-market-border rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-market-border bg-market-dark/50 flex justify-between items-center">
        <div>
           <h3 className="text-white font-bold text-sm flex items-center gap-2">
             <Calendar className="w-4 h-4 text-blue-500" />
             Tradable Today
           </h3>
           <p className="text-[10px] text-gray-400 mt-0.5">{days[day]}, {now.toLocaleDateString()}</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold border ${!isWeekend ? 'border-market-green/30 text-market-green bg-market-green/10' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'}`}>
           {isWeekend ? 'WEEKEND TRADING' : 'MARKETS ACTIVE'}
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {tradableAssets.map((asset, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border-b border-market-border hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${asset.isOpen ? 'bg-market-green shadow-[0_0_8px_rgba(0,200,5,0.5)]' : 'bg-market-red'}`} />
              <div>
                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{asset.ticker}</div>
                <div className="text-[10px] text-gray-500">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
               <div className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                 asset.isOpen 
                 ? 'border-market-green/20 text-market-green bg-market-green/5' 
                 : 'border-market-red/20 text-market-red bg-market-red/5'
               }`}>
                 {asset.status}
               </div>
               <div className="text-[10px] text-gray-600 mt-1">{asset.region} • {asset.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyStockList;
