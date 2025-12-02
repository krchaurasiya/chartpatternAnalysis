import React from 'react';

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface ChartAnalysisResult {
  patternName: string;
  confidence: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  supportLevels: string[];
  resistanceLevels: string[];
  analysis: string;
  actionableAdvice: string;
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface EducationalPattern {
  name: string;
  description: string;
  type: 'Bullish' | 'Bearish' | 'Neutral';
  imageUrl: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
}