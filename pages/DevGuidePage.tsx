import React from 'react';
import { Terminal, Code, Database, Layers, GitBranch, Cpu } from 'lucide-react';

const DevGuidePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="border-b border-market-border pb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Development Workflow & Architecture</h1>
        <p className="text-gray-400 text-lg">
          A comprehensive guide to the structure, workflow, and technology stack used to build this Pattern Recognition application.
        </p>
      </div>

      {/* Workflow Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
          <GitBranch className="w-6 h-6" /> Project Workflow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2 border-market-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <h3 className="text-white font-bold mb-1">1. Requirements & Research</h3>
              <p className="text-gray-400 text-sm">Define core patterns (Head & Shoulders, etc.) and API capabilities. Select Gemini Vision for multimodal analysis.</p>
            </div>
            <div className="relative pl-8 border-l-2 border-market-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <h3 className="text-white font-bold mb-1">2. UI/UX Design</h3>
              <p className="text-gray-400 text-sm">Design dark-mode interface inspired by financial terminals (Bloomberg, TradingView). Use Figma for prototyping.</p>
            </div>
            <div className="relative pl-8 border-l-2 border-market-border">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <h3 className="text-white font-bold mb-1">3. Development</h3>
              <p className="text-gray-400 text-sm">Implement React frontend. Integrate <code>@google/genai</code> SDK. Setup robust typing with TypeScript.</p>
            </div>
          </div>
          <div className="bg-market-card p-6 rounded-xl border border-market-border">
            <h3 className="text-white font-bold mb-4">Tech Stack</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-market-border pb-2">
                <span className="text-gray-400">Frontend</span>
                <span className="text-blue-400 font-mono text-sm">React 18, TypeScript, Tailwind</span>
              </div>
              <div className="flex justify-between items-center border-b border-market-border pb-2">
                <span className="text-gray-400">AI Model</span>
                <span className="text-blue-400 font-mono text-sm">Gemini 2.5 Flash (Vision)</span>
              </div>
              <div className="flex justify-between items-center border-b border-market-border pb-2">
                <span className="text-gray-400">Build Tool</span>
                <span className="text-blue-400 font-mono text-sm">Vite</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Icons</span>
                <span className="text-blue-400 font-mono text-sm">Lucide React</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
          <Layers className="w-6 h-6" /> File Structure
        </h2>
        <div className="bg-[#0d1117] p-6 rounded-xl border border-market-border overflow-x-auto">
          <pre className="font-mono text-sm text-gray-300">
{`project-root/
├── index.html              # Entry HTML
├── index.tsx               # Entry React logic
├── App.tsx                 # Routing & Layout
├── types.ts                # TypeScript Interfaces
├── components/
│   ├── Header.tsx          # Navigation
│   ├── Dropzone.tsx        # Drag & Drop Logic
│   └── ResultCard.tsx      # Analysis Visualization
├── pages/
│   ├── AnalyzerPage.tsx    # Core Feature
│   └── LibraryPage.tsx     # Education
├── services/
│   └── geminiService.ts    # AI Integration Logic
└── assets/                 # Static images/icons`}
          </pre>
        </div>
      </section>

      {/* Code Snippets Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
          <Code className="w-6 h-6" /> Key Implementation Details
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Backend/AI Logic */}
           <div>
             <h3 className="text-white font-bold mb-3 flex items-center gap-2">
               <Cpu className="w-4 h-4 text-purple-400" /> AI Model Integration
             </h3>
             <div className="bg-[#0d1117] p-4 rounded-xl border border-market-border text-xs font-mono text-gray-400 overflow-x-auto">
               <pre>{`// geminiService.ts
const ai = new GoogleGenAI({ 
  apiKey: process.env.API_KEY 
});

const model = "gemini-2.5-flash";

const response = await ai.models.generateContent({
  model,
  contents: {
    parts: [
      { inlineData: { mimeType: "image/png", data: base64 } },
      { text: "Analyze chart patterns..." }
    ]
  },
  config: { responseMimeType: "application/json" }
});`}</pre>
             </div>
           </div>

           {/* Data Structure */}
           <div>
             <h3 className="text-white font-bold mb-3 flex items-center gap-2">
               <Database className="w-4 h-4 text-green-400" /> Data Schema
             </h3>
             <div className="bg-[#0d1117] p-4 rounded-xl border border-market-border text-xs font-mono text-gray-400 overflow-x-auto">
               <pre>{`interface AnalysisResult {
  pattern: string;     // e.g. "Double Top"
  confidence: number;  // 0-100
  trend: "Bullish" | "Bearish";
  levels: {
    support: number[];
    resistance: number[];
  };
  advice: string;
}`}</pre>
             </div>
           </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
         <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
          <Terminal className="w-6 h-6" /> Final Thoughts & Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-market-card p-5 rounded-lg border border-market-border">
             <h4 className="text-white font-bold mb-2">Security</h4>
             <p className="text-gray-400 text-sm">Never expose API keys in client-side code in production. Use a proxy server or Edge Functions to sign requests.</p>
          </div>
          <div className="bg-market-card p-5 rounded-lg border border-market-border">
             <h4 className="text-white font-bold mb-2">Validation</h4>
             <p className="text-gray-400 text-sm">Always implement "Human-in-the-loop" disclaimers. AI can hallucinate; users should treat output as a second opinion.</p>
          </div>
          <div className="bg-market-card p-5 rounded-lg border border-market-border">
             <h4 className="text-white font-bold mb-2">Performance</h4>
             <p className="text-gray-400 text-sm">Compress images before sending to the API to reduce latency and bandwidth usage using Canvas API.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DevGuidePage;