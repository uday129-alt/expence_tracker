import { NextRequest, NextResponse } from 'next/server';
import { analyzeReceiptImage } from '@/lib/gemini';
import { parseExpenseData } from '@/utils/parseExpenseData';

/**
 * API Route to analyze receipt images using Gemini Vision
 * POST /api/analyze
 * Body: { image: base64_string }
 * Returns: { success: boolean, data?: string, error?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Analyze the image using Gemini
    const result = await analyzeReceiptImage(image);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Parse the extracted data
    const parsedData = parseExpenseData(result.data!);

    return NextResponse.json({
      success: true,
      data: result.data,
      parsed: parsedData,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
