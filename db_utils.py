"""
MongoDB utilities for Streamlit app
Handles database connections and operations
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import streamlit as st
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')


@st.cache_resource
def get_db_connection():
    """
    Get MongoDB database connection with caching
    Uses Streamlit's cache_resource to maintain connection across reruns
    """
    
    if not MONGODB_URI:
        raise Exception('MONGODB_URI environment variable not configured')
    
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000, connectTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        db = client['expense_tracker']
        return db
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        raise Exception(f'Failed to connect to MongoDB: {str(e)}')


def connect_db():
    """
    Initialize database connection
    """
    try:
        db = get_db_connection()
        # Ensure collection exists with indexes
        if 'expenses' not in db.list_collection_names():
            db.create_collection('expenses')
        
        # Create indexes
        expenses_col = db['expenses']
        expenses_col.create_index('createdAt')
        expenses_col.create_index('category')
        expenses_col.create_index('date')
        
        return db
    except Exception as e:
        raise Exception(f'Database connection error: {str(e)}')


def get_all_expenses() -> List[Dict[str, Any]]:
    """
    Fetch all expenses from MongoDB, sorted by creation date (newest first)
    """
    try:
        db = get_db_connection()
        expenses_col = db['expenses']
        
        expenses = list(expenses_col.find({}).sort('createdAt', -1))
        
        # Convert ObjectId to string for display
        for expense in expenses:
            if '_id' in expense:
                expense['_id'] = str(expense['_id'])
        
        return expenses
    except Exception as e:
        st.error(f"Error fetching expenses: {str(e)}")
        return []


def save_expense(expense_data: Dict[str, Any]) -> bool:
    """
    Save an expense to MongoDB
    
    Args:
        expense_data: Dictionary containing expense information
        
    Returns:
        True if successful, False otherwise
    """
    try:
        db = get_db_connection()
        expenses_col = db['expenses']
        
        # Validate required fields
        required_fields = ['storeName', 'date', 'amount', 'category', 'rawText']
        for field in required_fields:
            if field not in expense_data or not expense_data[field]:
                raise ValueError(f'Missing required field: {field}')
        
        # Parse amount (remove currency symbols)
        amount_str = str(expense_data['amount']).replace('$', '').replace(',', '').strip()
        try:
            amount = float(amount_str)
        except ValueError:
            raise ValueError(f'Invalid amount: {expense_data["amount"]}')
        
        # Prepare document
        document = {
            'storeName': expense_data.get('storeName', 'Unknown'),
            'date': expense_data.get('date', datetime.now().isoformat()),
            'amount': amount,
            'category': expense_data.get('category', 'Other'),
            'items': expense_data.get('items', []),
            'rawText': expense_data.get('rawText', ''),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
        }
        
        result = expenses_col.insert_one(document)
        return result.inserted_id is not None
        
    except ValueError as e:
        st.error(f"Validation error: {str(e)}")
        return False
    except Exception as e:
        st.error(f"Error saving expense: {str(e)}")
        return False


def get_expense_by_id(expense_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch a single expense by ID
    """
    try:
        from bson.objectid import ObjectId
        
        db = get_db_connection()
        expenses_col = db['expenses']
        
        expense = expenses_col.find_one({'_id': ObjectId(expense_id)})
        if expense:
            expense['_id'] = str(expense['_id'])
        
        return expense
    except Exception as e:
        st.error(f"Error fetching expense: {str(e)}")
        return None


def delete_expense(expense_id: str) -> bool:
    """
    Delete an expense from MongoDB
    """
    try:
        from bson.objectid import ObjectId
        
        db = get_db_connection()
        expenses_col = db['expenses']
        
        result = expenses_col.delete_one({'_id': ObjectId(expense_id)})
        return result.deleted_count > 0
    except Exception as e:
        st.error(f"Error deleting expense: {str(e)}")
        return False


def get_expenses_by_category(category: str) -> List[Dict[str, Any]]:
    """
    Fetch expenses filtered by category
    """
    try:
        db = get_db_connection()
        expenses_col = db['expenses']
        
        expenses = list(expenses_col.find({'category': category}).sort('createdAt', -1))
        
        for expense in expenses:
            if '_id' in expense:
                expense['_id'] = str(expense['_id'])
        
        return expenses
    except Exception as e:
        st.error(f"Error fetching expenses: {str(e)}")
        return []
