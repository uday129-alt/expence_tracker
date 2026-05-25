'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, TrendingDown, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-slate-900/50 border-b border-gray-700/30 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">💰</span>
            </div>
            <h1 className="text-xl font-bold text-white">ExpenseAI</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/upload"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              Start Scanning
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl w-full mt-20 space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Receipt Scanning
            </div>
          </motion.div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Powered by Google Gemini Vision AI. Instantly extract expense details from receipts and organize your spending.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/upload"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                <Zap className="w-5 h-5" />
                Start Scanning
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/history"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-gray-500/20 transition-all"
              >
                <TrendingDown className="w-5 h-5" />
                View History
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          {[
            {
              icon: '🤖',
              title: 'AI-Powered',
              description: 'Google Gemini Vision extracts data with 99% accuracy',
            },
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Get results in seconds with serverless processing',
            },
            {
              icon: '💾',
              title: 'Auto-Save',
              description: 'All expenses automatically stored in MongoDB',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="p-6 rounded-xl backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:from-gray-900/60 hover:to-gray-800/60 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40 text-center"
        >
          <p className="text-sm text-gray-400 mb-4">Powered by</p>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {['Next.js', 'Gemini AI', 'MongoDB', 'Tailwind CSS', 'Framer Motion'].map(
              (tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 text-sm font-medium"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-500 text-sm border-t border-gray-700/30 pt-8 pb-8 w-full">
        <p>
          Built with ❤️ using Google Gemini Vision API | Deployed on Vercel
        </p>
      </footer>
    </div>
  );
}
