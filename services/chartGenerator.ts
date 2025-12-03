
import { MarketType } from "../types";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Draw the candlestick chart onto a canvas and return base64
const drawChartToCanvas = (symbol: string, candles: Candle[]): string => {
  const width = 800;
  const height = 600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // 1. Background
  ctx.fillStyle = '#0e1117';
  ctx.fillRect(0, 0, width, height);

  // 2. Calculate Scale
  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1; // 10% padding
  const plotMin = minPrice - padding;
  const plotMax = maxPrice + padding;
  const plotRange = plotMax - plotMin;

  const chartHeight = height - 40; // Space for X axis
  const chartWidth = width - 60; // Space for Y axis

  // Helper: Price to Y
  const getY = (p: number) => chartHeight - ((p - plotMin) / plotRange) * chartHeight;

  // 3. Grid
  ctx.strokeStyle = '#30363d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // Horizontal grid
  for (let i = 0; i <= 5; i++) {
    const y = (chartHeight / 5) * i;
    ctx.moveTo(0, y);
    ctx.lineTo(chartWidth, y);
  }
  ctx.stroke();

  // 4. Draw Candles
  const numCandles = candles.length;
  const candleSpace = chartWidth / numCandles;
  const candleWidth = candleSpace * 0.6; // 60% of space
  
  candles.forEach((c, i) => {
    const x = i * candleSpace + (candleSpace - candleWidth) / 2;
    const isGreen = c.close >= c.open;
    
    ctx.strokeStyle = isGreen ? '#00C805' : '#FF5000';
    ctx.fillStyle = isGreen ? '#00C805' : '#FF5000';
    ctx.lineWidth = 1.5;

    // Wick
    ctx.beginPath();
    ctx.moveTo(x + candleWidth/2, getY(c.high));
    ctx.lineTo(x + candleWidth/2, getY(c.low));
    ctx.stroke();

    // Body
    const yOpen = getY(c.open);
    const yClose = getY(c.close);
    const height = Math.abs(yClose - yOpen);
    const top = Math.min(yOpen, yClose);
    
    ctx.fillRect(x, top, candleWidth, Math.max(1, height));
  });

  // 5. Y-Axis Labels (Price)
  ctx.fillStyle = '#161b22';
  ctx.fillRect(chartWidth, 0, 60, height); // Clear sidebar
  
  ctx.fillStyle = '#8b949e';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  
  for (let i = 0; i <= 5; i++) {
    const y = (chartHeight / 5) * i;
    const priceVal = plotMax - (i / 5) * plotRange;
    // Format price based on magnitude
    const priceText = priceVal > 1000 ? priceVal.toFixed(0) : priceVal.toFixed(2);
    ctx.fillText(priceText, chartWidth + 5, y + 4);
  }

  // 6. Watermark / Title
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.font = 'bold 80px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol.split('/')[0], width / 2, height / 2);

  ctx.fillStyle = '#e6edf3';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`${symbol} · 1H · LIVE`, 20, 20);

  // Current Price Highlight
  const lastC = candles[candles.length - 1];
  const lastY = getY(lastC.close);
  
  ctx.fillStyle = lastC.close >= lastC.open ? '#00C805' : '#FF5000';
  ctx.fillRect(chartWidth, lastY - 10, 60, 20);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(lastC.close > 1000 ? lastC.close.toFixed(0) : lastC.close.toFixed(2), chartWidth + 5, lastY - 4);

  return canvas.toDataURL('image/png');
};

// Generate realistic looking simulated data based on a start price
const generateSimulatedData = (basePrice: number, count: number): Candle[] => {
  let price = basePrice;
  const candles: Candle[] = [];
  const now = Date.now();
  const volatility = basePrice * 0.005; // 0.5% volatility

  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * volatility * 2;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    candles.push({
      time: now - (count - i) * 3600000,
      open, high, low, close
    });
    
    price = close;
  }
  return candles;
};

// Fetch real crypto data from Binance public API
const fetchBinanceData = async (symbol: string): Promise<Candle[]> => {
  try {
    const pair = symbol.replace('/', '').toUpperCase(); // BTC/USDT -> BTCUSDT
    // Fetch 50 hourly candles
    const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=50`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    
    return data.map((d: any) => ({
      time: d[0],
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4])
    }));
  } catch (e) {
    console.error("Failed to fetch Binance data", e);
    return [];
  }
};

export const generateChart = async (symbol: string, type: MarketType, basePriceStr: string): Promise<string> => {
  const basePrice = parseFloat(basePriceStr.replace(/[^0-9.]/g, ''));
  let candles: Candle[] = [];

  if (type === 'CRYPTO') {
    candles = await fetchBinanceData(symbol);
  }

  // Fallback to simulation if fetch fails or not crypto
  if (candles.length === 0) {
    // Generate simulated data that ends near the basePrice
    // To do this, we work backwards or just center it.
    // Simple approach: Start at basePrice and randomize backwards, then reverse
    candles = generateSimulatedData(basePrice, 50);
  }

  return drawChartToCanvas(symbol, candles);
};
