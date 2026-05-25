import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { ToastProvider } from '@/components/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Expense Tracker | Powered by Google Gemini',
  description: 'Smart receipt scanning and expense tracking using Google Gemini Vision API',
  keywords: ['expense tracker', 'receipt scanner', 'AI', 'Gemini', 'budget'],
  authors: [{ name: 'AI Expense Tracker' }],
  openGraph: {
    title: 'AI Expense Tracker',
    description: 'Smart receipt scanning and expense tracking',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        {/* Toast Provider */}
        <ToastProvider />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
