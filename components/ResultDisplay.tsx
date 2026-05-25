'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface ResultDisplayProps {
  data: string;
  onSave: () => void;
}

export default function ResultDisplay({
  data,
  onSave,
}: ResultDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Result Card */}
      <div className="relative rounded-xl overflow-hidden backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40 p-6 shadow-lg shadow-black/20">
        {/* Decorative Gradient */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />

        {/* Content */}
        <div className="relative z-10">
          <p className="text-sm text-gray-400 mb-3 font-semibold uppercase tracking-wider">
            Extracted Details
          </p>
          <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto space-y-2">
            {data.split('\n').map((line, idx) => (
              <div key={idx} className="text-gray-300">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copy
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
        >
          Save to History
        </motion.button>
      </div>
    </motion.div>
  );
}
