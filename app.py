import streamlit as st
import os
from datetime import datetime
from PIL import Image
import io
import base64
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from db_utils import connect_db, get_all_expenses, save_expense
from gemini_utils import analyze_receipt_image
from parse_utils import parse_expense_data

# Page config
st.set_page_config(
    page_title="Expense Tracker",
    page_icon="💰",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .expense-card {
        background-color: #f0f2f6;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 10px;
        border-left: 4px solid #FF6B35;
    }
    .expense-amount {
        font-size: 24px;
        font-weight: bold;
        color: #FF6B35;
    }
    .category-badge {
        display: inline-block;
        background-color: #004E89;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }
    </style>
""", unsafe_allow_html=True)

# Title
st.title("💰 Expense Tracker")
st.markdown("Powered by Google Gemini Vision AI")

# Initialize session state
if 'expenses' not in st.session_state:
    st.session_state.expenses = []
if 'analysis_result' not in st.session_state:
    st.session_state.analysis_result = None

# Sidebar
with st.sidebar:
    st.header("📊 Options")
    page = st.radio(
        "Select Page",
        ["📤 Upload Receipt", "📋 View History", "📊 Statistics"]
    )

# Main content
if page == "📤 Upload Receipt":
    st.header("Upload Receipt for Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📸 Upload Image")
        uploaded_file = st.file_uploader(
            "Choose a receipt image",
            type=["jpg", "jpeg", "png", "webp"],
            help="Upload a clear photo of your receipt/bill"
        )
        
        if uploaded_file:
            # Display uploaded image
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Receipt", use_column_width=True)
            
            # Convert image to base64
            image_buffer = io.BytesIO()
            image.convert('RGB').save(image_buffer, format='JPEG', quality=85)
            base64_image = base64.b64encode(image_buffer.getvalue()).decode()
            
            # Analyze button
            if st.button("🔍 Analyze Receipt", key="analyze_btn", use_container_width=True):
                with st.spinner("🤖 Analyzing receipt with Gemini..."):
                    result = analyze_receipt_image(base64_image)
                    
                    if result['success']:
                        st.session_state.analysis_result = result['data']
                        st.success("✅ Receipt analyzed successfully!")
                    else:
                        st.error(f"❌ Analysis failed: {result['error']}")
    
    with col2:
        st.subheader("📝 Extracted Data")
        
        if st.session_state.analysis_result:
            # Parse the result
            parsed = parse_expense_data(st.session_state.analysis_result)
            
            # Display raw Gemini response
            with st.expander("Raw Gemini Response"):
                st.text(st.session_state.analysis_result)
            
            # Display parsed data
            st.markdown("### Parsed Information")
            
            col_a, col_b = st.columns(2)
            with col_a:
                st.markdown(f"**Store:** {parsed['storeName']}")
                st.markdown(f"**Date:** {parsed['date']}")
            with col_b:
                st.markdown(f"**Amount:** {parsed['amount']}")
                st.markdown(f"**Category:** {parsed['category']}")
            
            st.markdown("**Items:**")
            for item in parsed['items']:
                st.write(f"• {item}")
            
            # Edit section
            st.markdown("---")
            st.markdown("### ✏️ Edit & Save")
            
            with st.form("save_expense_form"):
                store_name = st.text_input("Store Name", value=parsed['storeName'])
                amount = st.text_input("Amount", value=parsed['amount'])
                date_str = st.text_input("Date", value=parsed['date'])
                category = st.selectbox(
                    "Category",
                    ["Food", "Transport", "Shopping", "Entertainment", "Utilities", "Other"],
                    index=0 if parsed['category'] not in ["Food", "Transport", "Shopping", "Entertainment", "Utilities", "Other"] else ["Food", "Transport", "Shopping", "Entertainment", "Utilities", "Other"].index(parsed['category'])
                )
                items_text = st.text_area("Items (one per line)", value="\n".join(parsed['items']))
                
                if st.form_submit_button("💾 Save Expense", use_container_width=True):
                    # Prepare expense data
                    expense_data = {
                        'storeName': store_name,
                        'date': date_str,
                        'amount': amount,
                        'category': category,
                        'items': [item.strip() for item in items_text.split('\n') if item.strip()],
                        'rawText': st.session_state.analysis_result,
                    }
                    
                    # Save to MongoDB
                    with st.spinner("💾 Saving to database..."):
                        try:
                            save_result = save_expense(expense_data)
                            if save_result:
                                st.success("✅ Expense saved successfully!")
                                st.session_state.analysis_result = None
                                st.rerun()
                            else:
                                st.error("❌ Failed to save expense")
                        except Exception as e:
                            st.error(f"❌ Error: {str(e)}")
        else:
            st.info("📤 Upload and analyze a receipt to see extracted data here")

elif page == "📋 View History":
    st.header("Expense History")
    
    with st.spinner("📥 Loading expenses..."):
        expenses = get_all_expenses()
    
    if expenses:
        # Filter options
        col1, col2 = st.columns(2)
        with col1:
            categories = ["All"] + list(set([e.get('category', 'Other') for e in expenses]))
            selected_category = st.selectbox("Filter by Category", categories)
        
        with col2:
            sort_by = st.selectbox("Sort by", ["Date (Newest)", "Date (Oldest)", "Amount (High to Low)", "Amount (Low to High)"])
        
        # Filter expenses
        filtered_expenses = expenses
        if selected_category != "All":
            filtered_expenses = [e for e in expenses if e.get('category') == selected_category]
        
        # Sort expenses
        if sort_by == "Date (Newest)":
            filtered_expenses.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        elif sort_by == "Date (Oldest)":
            filtered_expenses.sort(key=lambda x: x.get('createdAt', ''))
        elif sort_by == "Amount (High to Low)":
            filtered_expenses.sort(key=lambda x: float(str(x.get('amount', 0)).replace('$', '').replace(',', '')), reverse=True)
        else:
            filtered_expenses.sort(key=lambda x: float(str(x.get('amount', 0)).replace('$', '').replace(',', '')))
        
        st.markdown(f"### 📊 Total Expenses: {len(filtered_expenses)}")
        
        total_amount = sum(float(str(e.get('amount', 0)).replace('$', '').replace(',', '')) for e in filtered_expenses)
        st.metric("Total Amount", f"${total_amount:.2f}")
        
        st.markdown("---")
        
        # Display expenses
        for expense in filtered_expenses:
            with st.container():
                col1, col2, col3, col4 = st.columns([2, 1, 1, 1])
                
                with col1:
                    st.markdown(f"**{expense.get('storeName', 'Unknown')}**")
                    items_preview = ", ".join(expense.get('items', [])[:2])
                    if len(expense.get('items', [])) > 2:
                        items_preview += f" +{len(expense.get('items', [])) - 2} more"
                    st.caption(f"Items: {items_preview}")
                
                with col2:
                    st.markdown(f"<span class='expense-amount'>${float(str(expense.get('amount', 0)).replace('$', '').replace(',', '')):.2f}</span>", unsafe_allow_html=True)
                
                with col3:
                    category = expense.get('category', 'Other')
                    st.markdown(f"<span class='category-badge'>{category}</span>", unsafe_allow_html=True)
                
                with col4:
                    date_str = expense.get('date', 'N/A')
                    st.caption(date_str)
                
                st.divider()
    else:
        st.info("📭 No expenses recorded yet. Upload a receipt to get started!")

elif page == "📊 Statistics":
    st.header("Expense Statistics")
    
    with st.spinner("📊 Loading data..."):
        expenses = get_all_expenses()
    
    if expenses:
        col1, col2, col3 = st.columns(3)
        
        total_amount = sum(float(str(e.get('amount', 0)).replace('$', '').replace(',', '')) for e in expenses)
        avg_amount = total_amount / len(expenses) if expenses else 0
        
        with col1:
            st.metric("Total Expenses", f"${total_amount:.2f}")
        with col2:
            st.metric("Average Expense", f"${avg_amount:.2f}")
        with col3:
            st.metric("Total Records", len(expenses))
        
        st.markdown("---")
        
        # Category breakdown
        st.subheader("💹 Expenses by Category")
        category_totals = {}
        for expense in expenses:
            cat = expense.get('category', 'Other')
            amount = float(str(expense.get('amount', 0)).replace('$', '').replace(',', ''))
            category_totals[cat] = category_totals.get(cat, 0) + amount
        
        if category_totals:
            st.bar_chart({k: v for k, v in category_totals.items()})
            
            st.markdown("### Category Details")
            for cat, amount in sorted(category_totals.items(), key=lambda x: x[1], reverse=True):
                st.write(f"**{cat}:** ${amount:.2f}")
    else:
        st.info("📭 No data available. Start by uploading receipts!")

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: gray; font-size: 12px;'>
    Expense Tracker v1.0 | Powered by Google Gemini Vision API & MongoDB
    </div>
    """,
    unsafe_allow_html=True
)
