'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  onImageSelect,
  disabled = false,
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer backdrop-blur-md ${
          dragActive
            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
            : 'border-gray-300/50 bg-gray-900/20 hover:border-gray-400/70'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ y: dragActive ? -5 : 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"
          >
            <Upload className="w-8 h-8 text-blue-400" />
          </motion.div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              {dragActive ? 'Drop your receipt here' : 'Drag & drop receipt image'}
            </p>
            <p className="text-sm text-gray-400 mt-1">or click to select</p>
          </div>
        </div>
      </motion.div>

      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 relative rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 border border-blue-500/30"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Clear
          </button>
        </motion.div>
      )}
    </div>
  );
}
