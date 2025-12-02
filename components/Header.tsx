import React from 'react';
import { TrendingUp, BarChart2, BookOpen, Terminal } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-400 bg-market-card' : 'text-gray-400 hover:text-white';
  };

  return (
    <header className="border-b border-market-border bg-market-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight text-white">ChartPattern<span className="text-blue-500">Pro</span> AI</span>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/')}`}
            >
              <BarChart2 className="w-4 h-4" />
              Analyzer
            </Link>
            <Link
              to="/library"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/library')}`}
            >
              <BookOpen className="w-4 h-4" />
              Pattern Library
            </Link>
            <Link
              to="/dev-guide"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isActive('/dev-guide')}`}
            >
              <Terminal className="w-4 h-4" />
              Dev Guide
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;