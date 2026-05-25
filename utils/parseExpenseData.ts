/**
 * Parse expense data from Gemini's text response
 * Extracts structured information from the raw text
 */

export interface ParsedExpense {
  storeName: string;
  date: string;
  amount: string;
  category: string;
  items: string[];
  rawText: string;
}

export const parseExpenseData = (rawText: string): ParsedExpense => {
  const parsed: ParsedExpense = {
    storeName: 'Unknown Store',
    date: new Date().toISOString().split('T')[0],
    amount: '0',
    category: 'Other',
    items: [],
    rawText: rawText,
  };

  // Extract Store name
  const storeMatch = rawText.match(/Store:\s*([^\n]+)/i);
  if (storeMatch) {
    parsed.storeName = storeMatch[1].trim();
  }

  // Extract Date
  const dateMatch = rawText.match(/Date:\s*([^\n]+)/i);
  if (dateMatch) {
    parsed.date = dateMatch[1].trim();
  }

  // Extract Amount
  const amountMatch = rawText.match(/Amount:\s*([^\n]+)/i);
  if (amountMatch) {
    parsed.amount = amountMatch[1].trim();
  }

  // Extract Category
  const categoryMatch = rawText.match(/Category:\s*([^\n]+)/i);
  if (categoryMatch) {
    parsed.category = categoryMatch[1].trim();
  }

  // Extract Items
  const itemsSection = rawText.match(/Items:\s*([\s\S]*?)(?=\n\n|$)/i);
  if (itemsSection) {
    const itemLines = itemsSection[1].split('\n');
    parsed.items = itemLines
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter((line) => line.length > 0);
  }

  return parsed;
};
