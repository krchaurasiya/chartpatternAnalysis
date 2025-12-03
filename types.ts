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
  imageUrl?: string;
}

export interface RLDecision {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100 (Q-Value proxy)
  rewardRiskRatio: number;
  suggestedEntry: string;
  stopLoss: string;
  takeProfit: string;
  reasoning: string;
  detectedState: {
    trend: string;
    volatility: string;
    keyLevels: string;
  };
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

export type MarketType = 'CRYPTO' | 'STOCK_IN' | 'FOREX';

export interface MarketData {
  symbol: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  isUp: boolean;
  type: MarketType;
}

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}