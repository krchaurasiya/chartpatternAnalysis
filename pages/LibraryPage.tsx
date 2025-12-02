import React from 'react';
import { EducationalPattern } from '../types';

const patterns: EducationalPattern[] = [
  {
    name: "Head and Shoulders",
    description: "A reversal pattern that signals a trend change from bullish to bearish. It consists of three peaks: a higher peak (head) between two lower peaks (shoulders).",
    type: "Bearish",
    imageUrl: "https://picsum.photos/400/200?grayscale" 
  },
  {
    name: "Double Bottom",
    description: "A bullish reversal pattern describing the drop of a stock, a rebound, another drop to the same level, and another rebound.",
    type: "Bullish",
    imageUrl: "https://picsum.photos/401/200?grayscale"
  },
  {
    name: "Bull Flag",
    description: "A continuation pattern where a strong upward move (the pole) is followed by a consolidation channel (the flag), usually leading to further upside.",
    type: "Bullish",
    imageUrl: "https://picsum.photos/402/200?grayscale"
  },
  {
    name: "Descending Triangle",
    description: "A bearish continuation pattern characterized by a descending upper trendline and a flat lower support line.",
    type: "Bearish",
    imageUrl: "https://picsum.photos/403/200?grayscale"
  }
];

const LibraryPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Pattern Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {patterns.map((pattern, idx) => (
          <div key={idx} className="bg-market-card border border-market-border rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors">
            <div className="h-48 bg-gray-800 relative">
               <img src={pattern.imageUrl} alt={pattern.name} className="w-full h-full object-cover opacity-50 hover:opacity-75 transition-opacity" />
               <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                 ${pattern.type === 'Bullish' ? 'bg-market-green text-black' : 
                   pattern.type === 'Bearish' ? 'bg-market-red text-white' : 'bg-gray-500 text-white'}`}>
                 {pattern.type}
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{pattern.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{pattern.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;