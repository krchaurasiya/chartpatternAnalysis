import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AnalyzerPage from './pages/AnalyzerPage';
import LibraryPage from './pages/LibraryPage';
import DevGuidePage from './pages/DevGuidePage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-market-dark text-gray-200">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<AnalyzerPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/dev-guide" element={<DevGuidePage />} />
          </Routes>
        </main>
        <footer className="border-t border-market-border py-6 bg-market-dark">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} ChartPatternPro AI. Powered by Google Gemini 2.5 Flash.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;