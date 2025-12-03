import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AnalyzerPage from './pages/AnalyzerPage';
import LibraryPage from './pages/LibraryPage';
import DevGuidePage from './pages/DevGuidePage';
import AgentPage from './pages/AgentPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-market-dark text-gray-200 selection:bg-blue-500/30">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<AnalyzerPage />} />
            <Route path="/agent" element={<AgentPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/dev-guide" element={<DevGuidePage />} />
          </Routes>
        </main>
        <footer className="border-t border-market-border py-6 bg-market-dark mt-auto">
          <div className="container mx-auto px-4 text-center text-gray-600 text-xs font-mono">
            <p className="mb-2">&copy; {new Date().getFullYear()} QuantumTrade AI. Professional Trading Suite.</p>
            <p className="opacity-50">Disclaimer: Simulation only. Not financial advice. Trading involves risk.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;