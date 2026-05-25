'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, MapPin, Tag, ShoppingCart } from 'lucide-react';

interface Expense {
  _id: string;
  storeName: string;
  date: string;
  amount: string;
  category: string;
  items: string[];
}

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Food: 'from-orange-500 to-red-500',
  Shopping: 'from-pink-500 to-rose-500',
  Travel: 'from-blue-500 to-cyan-500',
  Utilities: 'from-yellow-500 to-amber-500',
  Entertainment: 'from-purple-500 to-pink-500',
  Health: 'from-green-500 to-emerald-500',
  Other: 'from-gray-500 to-slate-500',
};

export default function ExpenseCard({
  expense,
  onDelete,
}: ExpenseCardProps) {
  const gradient =
    categoryColors[expense.category] || categoryColors['Other'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:from-gray-900/60 hover:to-gray-800/60 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 p-5"
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white truncate">
              {expense.storeName}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} text-white`}
              >
                <Tag className="w-3 h-3" />
                {expense.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {expense.date}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(expense._id)}
            className="ml-2 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Amount */}
        <div className="mb-4 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
          <p className="text-xs text-gray-400 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            {expense.amount}
          </p>
        </div>

        {/* Items */}
        {expense.items && expense.items.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium text-gray-300">
                Items ({expense.items.length})
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {expense.items.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300"
                >
                  {item}
                </span>
              ))}
              {expense.items.length > 3 && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-400">
                  +{expense.items.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
