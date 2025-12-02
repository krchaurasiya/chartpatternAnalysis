import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface DropzoneProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({ onImageSelected, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-market-border hover:border-blue-400 hover:bg-market-card'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerSelect}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange} 
          accept="image/*"
        />

        {preview ? (
          <div className="relative h-64 w-full flex items-center justify-center">
             <img src={preview} alt="Chart Preview" className="max-h-full max-w-full rounded-lg shadow-lg object-contain" />
             {isLoading && (
               <div className="absolute inset-0 bg-market-dark/60 flex items-center justify-center rounded-lg backdrop-blur-sm">
                 <div className="text-center">
                   <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-2" />
                   <p className="text-blue-400 font-mono text-sm animate-pulse">Running Neural Networks...</p>
                 </div>
               </div>
             )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="p-4 bg-market-card rounded-full border border-market-border">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-gray-300">
              <p className="font-medium text-lg">Drop your chart here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse files (JPG, PNG)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;