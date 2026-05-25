import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

export const analyzeReceiptImage = async (base64Image: string) => {
  try {
    const model = getGeminiModel();

    const prompt = `Analyze this receipt/bill image and extract the following information in a structured format:

1. Store name
2. Date (in format DD MMMM YYYY)
3. Total amount (with currency symbol)
4. Purchased items (as a list)
5. Expense category (e.g., Food, Shopping, Travel, etc.)

Return the output in clean, readable text format. Use clear labels and bullet points.
If any information is not available, mention it as "Not found".

Format the response like this:
Store: [Store Name]
Date: [Date]
Amount: [Total Amount]
Category: [Category]

Items:
- [Item 1]
- [Item 2]
- [Item 3]`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text,
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze image',
    };
  }
};
