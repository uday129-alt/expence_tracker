"""
Gemini API utilities for Streamlit app
Handles image analysis using Google Gemini Vision API
"""

import os
import base64
import requests
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv('NEXT_PUBLIC_GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


def analyze_receipt_image(base64_image: str) -> Dict[str, Any]:
    """
    Analyze a receipt image using Google Gemini Vision API
    
    Args:
        base64_image: Base64 encoded image string
        
    Returns:
        Dictionary with 'success' and 'data' or 'error' keys
    """
    
    if not GEMINI_API_KEY:
        return {
            'success': False,
            'error': 'GEMINI_API_KEY not configured'
        }
    
    try:
        prompt = """Analyze this receipt/bill image and extract the following information in a structured format:

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
- [Item 3]"""

        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": "image/jpeg",
                                "data": base64_image
                            }
                        }
                    ]
                }
            ]
        }
        
        headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
        }
        
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code != 200:
            error_data = response.json()
            error_msg = error_data.get('error', {}).get('message', 'Unknown error')
            
            # Check for quota exceeded
            if 'RESOURCE_EXHAUSTED' in error_msg or 'quota' in error_msg.lower():
                return {
                    'success': False,
                    'error': f'API Quota Exceeded: {error_msg}'
                }
            
            return {
                'success': False,
                'error': f'API Error: {error_msg}'
            }
        
        result = response.json()
        
        # Extract text from response
        if 'candidates' in result and len(result['candidates']) > 0:
            text = result['candidates'][0].get('content', {}).get('parts', [{}])[0].get('text', '')
            return {
                'success': True,
                'data': text
            }
        
        return {
            'success': False,
            'error': 'No response from Gemini API'
        }
        
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error': 'Request timeout - API took too long to respond'
        }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f'Network error: {str(e)}'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f'Error: {str(e)}'
        }
