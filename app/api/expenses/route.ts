import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';

/**
 * GET /api/expenses
 * Fetch all expenses from MongoDB
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const expenses = await Expense.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error('GET expenses error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch expenses',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Save an expense to MongoDB
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      storeName,
      date,
      amount,
      category,
      items,
      rawText,
    } = body;

    if (!storeName || !date || !amount || !category || !rawText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Parse amount (remove currency symbol if present)
    const parsedAmount = parseFloat(
      amount.replace(/[^\d.-]/g, '')
    );

    const expense = new Expense({
      storeName,
      date: new Date(date),
      amount: parsedAmount,
      category,
      items: items || [],
      rawText,
    });

    await expense.save();

    return NextResponse.json({
      success: true,
      data: expense,
      message: 'Expense saved successfully',
    });
  } catch (error) {
    console.error('POST expenses error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to save expense',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/expenses?id=<expense_id>
 * Delete an expense from MongoDB
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await Expense.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Expense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('DELETE expenses error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete expense',
      },
      { status: 500 }
    );
  }
}
