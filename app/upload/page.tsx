'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ParsedData {
  storeName: string;
  date: string;
  amount: string;
  category: string;
  items: string[];
  rawText: string;
}

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const router = useRouter();

  const handleImageSelect = async (base64Image: string) => {
    setLoading(true);
    setResult(null);
    setParsedData(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        setParsedData(data.parsed);
        toast.success('Receipt analyzed successfully!');
      } else {
        toast.error(data.error || 'Failed to analyze receipt');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while analyzing the receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpense = async () => {
    if (!parsedData) return;

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Expense saved successfully!');
        // Reset state
        setResult(null);
        setParsedData(null);
        // Redirect to history after 1.5 seconds
        setTimeout(() => router.push('/history'), 1500);
      } else {
        toast.error(data.error || 'Failed to save expense');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while saving the expense');
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      {/* Navigation */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all z-40"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="max-w-2xl mx-auto mt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Upload Receipt
          </h1>
          <p className="text-gray-400">
            Take a photo or upload an image of your receipt to extract expense details
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {!result ? (
            <ImageUploader
              onImageSelect={handleImageSelect}
              disabled={loading}
            />
          ) : (
            <ResultDisplay
              data={result}
              onSave={handleSaveExpense}
            />
          )}
        </motion.div>

        {/* Tips Section */}
        {!result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 p-6 rounded-xl backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40"
          >
            <h3 className="text-lg font-semibold text-white mb-4">📸 Tips for Best Results:</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Make sure the receipt is clearly visible and not blurry</li>
              <li>✓ Good lighting is important - avoid shadows</li>
              <li>✓ Include all expense details in the frame</li>
              <li>✓ Supported formats: JPG, PNG, WebP, GIF</li>
              <li>✓ Maximum file size: 20MB</li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && <LoadingSpinner message="Analyzing receipt with AI..." />}
    </div>
  );
}
