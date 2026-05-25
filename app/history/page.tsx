'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ExpenseCard from '@/components/ExpenseCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Search, Filter } from 'lucide-react';

interface Expense {
  _id: string;
  storeName: string;
  date: string;
  amount: string;
  category: string;
  items: string[];
}

export default function HistoryPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      const data = await response.json();

      if (data.success) {
        // Format the expense data
        const formattedExpenses = data.data.map((exp: any) => ({
          _id: exp._id,
          storeName: exp.storeName,
          date: exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A',
          amount: exp.amount?.toString() || '0',
          category: exp.category,
          items: exp.items || [],
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setExpenses(expenses.filter((exp) => exp._id !== id));
        toast.success('Expense deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('An error occurred while deleting the expense');
    }
  };

  // Filter and search expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.storeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterCategory === 'All' || exp.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = ['All', ...new Set(expenses.map((exp) => exp.category))];

  // Calculate totals
  const totalAmount = filteredExpenses.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );

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

      <div className="max-w-6xl mx-auto mt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Expense History
          </h1>
          <p className="text-gray-400">
            View and manage all your tracked expenses
          </p>
        </motion.div>

        {!loading && expenses.length > 0 && (
          <>
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl backdrop-blur-md border border-gray-300/20 bg-gradient-to-br from-gray-900/40 to-gray-800/40"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-white">
                    {filteredExpenses.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    ₹{totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Average Expense</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ₹
                    {filteredExpenses.length > 0
                      ? (totalAmount / filteredExpenses.length).toFixed(2)
                      : '0'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 space-y-4"
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by store name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                      filterCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Expenses Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredExpenses.map((expense) => (
                  <ExpenseCard
                    key={expense._id}
                    expense={expense}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State for Filtered Results */}
            {filteredExpenses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-gray-400 text-lg">
                  No expenses found matching your filters
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && expenses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-6"
          >
            <div className="text-6xl">📭</div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                No Expenses Yet
              </h2>
              <p className="text-gray-400 mb-6">
                Start tracking your expenses by uploading your first receipt
              </p>
              <Link
                href="/upload"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Upload Receipt
              </Link>
            </div>
          </motion.div>
        )}

        {loading && <LoadingSpinner message="Loading expenses..." />}
      </div>
    </div>
  );
}
