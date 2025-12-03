import React from 'react';
import { TrendingUp, BarChart2, BookOpen, Cpu, Activity } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-400 bg-market-card shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5';
  };

  return (
    <header className="border-b border-market-border bg-market-dark sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="relative">
                <Activity className="h-8 w-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-market-green rounded-full animate-pulse"></div>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Quantum<span className="text-blue-500">Trade</span> AI</span>
            </Link>
          </div>
          <nav className="flex space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/')}`}
            >
              <BarChart2 className="w-4 h-4" />
              <span className="hidden sm:inline">Technical Analyzer</span>
            </Link>
            <Link
              to="/agent"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/agent')}`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">RL Agent</span>
            </Link>
            <Link
              to="/library"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive('/library')}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;