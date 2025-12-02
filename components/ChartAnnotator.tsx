import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Check, X, Undo, Type } from 'lucide-react';

interface ChartAnnotatorProps {
  imageBase64: string;
  onConfirm: (annotatedImageBase64: string) => void;
  onCancel: () => void;
}

const ChartAnnotator: React.FC<ChartAnnotatorProps> = ({ imageBase64, onConfirm, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'PEN' | 'LINE'>('PEN');
  const [color, setColor] = useState('#00C805'); // Default Green
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);

  // Initialize Canvas with Image
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      if (canvas && ctx && containerRef.current) {
        // Calculate aspect ratio to fit in container
        const containerWidth = containerRef.current.clientWidth;
        const scale = containerWidth / img.width;
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        // We style the canvas via CSS to fit, but internal resolution matches image
        ctx.drawImage(img, 0, 0);
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    };
    img.src = imageBase64;
  }, [imageBase64]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setStartPos(pos);
    
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const currentPos = getPos(e);

    if (ctx && startPos && snapshot) {
      if (tool === 'LINE') {
        // Restore previous state to avoid trailing lines
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
      } else {
        // Free draw
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
  };

  const handleConfirm = () => {
    if (canvasRef.current) {
      onConfirm(canvasRef.current.toDataURL('image/png'));
    }
  };

  return (
    <div className="w-full bg-market-card border border-market-border rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-market-dark/50 p-4 border-b border-market-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <PenTool className="w-4 h-4 text-blue-400" /> Annotate Chart
          </h3>
          <div className="h-6 w-px bg-market-border"></div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTool('PEN')}
              className={`p-2 rounded hover:bg-white/10 ${tool === 'PEN' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}
              title="Freehand"
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button 
               onClick={() => setTool('LINE')}
               className={`p-2 rounded hover:bg-white/10 ${tool === 'LINE' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}
               title="Straight Line"
            >
              <MinusIcon className="w-4 h-4 rotate-45" />
            </button>
            <div className="flex gap-1 ml-2">
              <button onClick={() => setColor('#00C805')} className={`w-6 h-6 rounded-full bg-[#00C805] ${color === '#00C805' ? 'ring-2 ring-white' : ''}`} />
              <button onClick={() => setColor('#FF5000')} className={`w-6 h-6 rounded-full bg-[#FF5000] ${color === '#FF5000' ? 'ring-2 ring-white' : ''}`} />
              <button onClick={() => setColor('#3b82f6')} className={`w-6 h-6 rounded-full bg-blue-500 ${color === '#3b82f6' ? 'ring-2 ring-white' : ''}`} />
              <button onClick={() => setColor('#ffffff')} className={`w-6 h-6 rounded-full bg-white ${color === '#ffffff' ? 'ring-2 ring-gray-400' : ''}`} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={onCancel}
             className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleConfirm}
             className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors font-medium"
           >
             <Check className="w-4 h-4" /> Analyze
           </button>
        </div>
      </div>
      
      <div ref={containerRef} className="relative w-full bg-market-dark cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto block max-h-[600px] object-contain"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/50 bg-black/50 px-3 py-1 rounded-full pointer-events-none">
          Draw trendlines or support/resistance zones before analyzing
        </div>
      </div>
    </div>
  );
};

// Helper icon
const MinusIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default ChartAnnotator;
