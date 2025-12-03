
import React from 'react';
import { Calendar, Globe, TrendingUp, DollarSign, MousePointerClick } from 'lucide-react';
import { MarketType } from '../types';

export interface StockItem {
  ticker: string;
  name: string;
  type: MarketType;
  region: 'US' | 'IN' | 'GLOBAL' | 'EU';
  price: string;
  change: number;
}

export const STOCK_DB: StockItem[] = [
  { ticker: 'BTC/USDT', name: 'Bitcoin', type: 'CRYPTO', region: 'GLOBAL', price: '96,400', change: 2.4 },
  { ticker: 'ETH/USDT', name: 'Ethereum', type: 'CRYPTO', region: 'GLOBAL', price: '2,650', change: -1.2 },
  { ticker: 'RELIANCE', name: 'Reliance Ind.', type: 'STOCK_IN', region: 'IN', price: '2,980', change: 1.5 },
  { ticker: 'TCS', name: 'Tata Consultancy', type: 'STOCK_IN', region: 'IN', price: '4,120', change: 0.8 },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', type: 'STOCK_IN', region: 'IN', price: '1,450', change: -0.5 },
  { ticker: 'EUR/USD', name: 'Euro', type: 'FOREX', region: 'EU', price: '1.0854', change: 0.02 },
  { ticker: 'GBP/USD', name: 'Pound', type: 'FOREX', region: 'EU', price: '1.2650', change: -0.1 },
  { ticker: 'USD/JPY', name: 'Yen', type: 'FOREX', region: 'GLOBAL', price: '151.24', change: 0.3 },
];

interface DailyStockListProps {
  onStockSelect?: (ticker: string) => void;
}

const DailyStockList: React.FC<DailyStockListProps> = ({ onStockSelect }) => {
  return (
    <div className="bg-market-card border border-market-border rounded-xl overflow-hidden mt-6 flex flex-col h-full">
      <div className="p-4 border-b border-market-border bg-market-dark/50 flex justify-between items-center">
         <h3 className="text-white font-bold text-sm flex items-center gap-2">
           <TrendingUp className="w-4 h-4 text-blue-500" />
           Tradable Today
         </h3>
         <span className="text-[10px] text-gray-500 bg-market-dark px-2 py-0.5 rounded border border-market-border flex items-center gap-1">
            <MousePointerClick className="w-3 h-3" /> Select to Analyze
         </span>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {STOCK_DB.map((asset, idx) => (
          <div 
            key={idx} 
            onClick={() => onStockSelect && onStockSelect(asset.ticker)}
            className="flex items-center justify-between p-3 border-b border-market-border hover:bg-white/5 transition-colors cursor-pointer group active:bg-blue-500/10"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${asset.change >= 0 ? 'bg-market-green/10 text-market-green' : 'bg-market-red/10 text-market-red'}`}>
                 {asset.type === 'CRYPTO' ? <DollarSign className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">{asset.ticker}</div>
                <div className="text-[10px] text-gray-500">{asset.name}</div>
              </div>
            </div>
            <div className="text-right">
               <div className="text-xs font-mono font-medium text-white">{asset.price}</div>
               <div className={`text-[10px] font-mono ${asset.change >= 0 ? 'text-market-green' : 'text-market-red'}`}>
                 {asset.change > 0 ? '+' : ''}{asset.change}%
               </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 text-center border-t border-market-border bg-market-dark/30">
        <span className="text-[10px] text-gray-600">Real-time Quotes (Simulated)</span>
      </div>
    </div>
  );
};

export default DailyStockList;
