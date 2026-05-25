"""
Parse utility functions for extracting structured data from Gemini responses
"""

from typing import Dict, List
from datetime import datetime


def parse_expense_data(raw_text: str) -> Dict[str, any]:
    """
    Parse expense data from Gemini's text response
    Extracts structured information from the raw text
    
    Args:
        raw_text: Raw text response from Gemini API
        
    Returns:
        Dictionary with parsed expense information
    """
    
    parsed = {
        'storeName': 'Unknown Store',
        'date': datetime.now().strftime('%d %B %Y'),
        'amount': '0',
        'category': 'Other',
        'items': [],
        'rawText': raw_text,
    }
    
    if not raw_text:
        return parsed
    
    # Extract Store name
    store_match = None
    for line in raw_text.split('\n'):
        if line.lower().startswith('store:'):
            store_match = line.split(':', 1)[1].strip()
            break
    
    if store_match and store_match.lower() != 'not found':
        parsed['storeName'] = store_match
    
    # Extract Date
    date_match = None
    for line in raw_text.split('\n'):
        if line.lower().startswith('date:'):
            date_match = line.split(':', 1)[1].strip()
            break
    
    if date_match and date_match.lower() != 'not found':
        parsed['date'] = date_match
    
    # Extract Amount
    amount_match = None
    for line in raw_text.split('\n'):
        if line.lower().startswith('amount:'):
            amount_match = line.split(':', 1)[1].strip()
            break
    
    if amount_match and amount_match.lower() != 'not found':
        parsed['amount'] = amount_match
    
    # Extract Category
    category_match = None
    for line in raw_text.split('\n'):
        if line.lower().startswith('category:'):
            category_match = line.split(':', 1)[1].strip()
            break
    
    if category_match and category_match.lower() != 'not found':
        parsed['category'] = category_match
    
    # Extract Items
    items = []
    capture_items = False
    
    for line in raw_text.split('\n'):
        if line.lower().startswith('items:'):
            capture_items = True
            continue
        
        if capture_items:
            # Stop if we hit another section
            if line and not line.startswith('-') and not line.startswith('•') and ':' in line:
                break
            
            # Extract items (lines starting with - or •)
            line = line.strip()
            if line.startswith('-'):
                item = line[1:].strip()
                if item and item.lower() != 'not found':
                    items.append(item)
            elif line.startswith('•'):
                item = line[1:].strip()
                if item and item.lower() != 'not found':
                    items.append(item)
            elif line and not line.startswith('-') and not line.startswith('•'):
                # Try to capture items without markers
                if capture_items and line.lower() not in ['not found', '', 'items:']:
                    items.append(line)
    
    parsed['items'] = items if items else []
    
    return parsed


def validate_expense_data(expense_data: Dict) -> tuple[bool, str]:
    """
    Validate expense data
    
    Args:
        expense_data: Dictionary with expense information
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    
    # Check required fields
    required_fields = ['storeName', 'date', 'amount', 'category']
    for field in required_fields:
        if field not in expense_data or not expense_data[field]:
            return False, f'Missing required field: {field}'
    
    # Validate amount
    try:
        amount_str = str(expense_data['amount']).replace('$', '').replace(',', '').strip()
        amount = float(amount_str)
        if amount <= 0:
            return False, 'Amount must be greater than 0'
    except ValueError:
        return False, f'Invalid amount format: {expense_data["amount"]}'
    
    # Validate store name
    if len(str(expense_data['storeName']).strip()) == 0:
        return False, 'Store name cannot be empty'
    
    return True, ''


def format_currency(amount: float, currency: str = '$') -> str:
    """
    Format amount as currency
    
    Args:
        amount: Amount to format
        currency: Currency symbol (default: $)
        
    Returns:
        Formatted currency string
    """
    return f'{currency}{amount:,.2f}'


def extract_items_from_text(text: str) -> List[str]:
    """
    Extract items from bullet/dash formatted text
    
    Args:
        text: Text containing items
        
    Returns:
        List of items
    """
    items = []
    for line in text.split('\n'):
        line = line.strip()
        if line.startswith('-') or line.startswith('•'):
            item = line[1:].strip()
            if item:
                items.append(item)
    
    return items
