# Streamlit Deployment Guide

This is the Streamlit version of the Expense Tracker application. It replaces the Next.js frontend with a Streamlit web app.

## Prerequisites

- Python 3.8+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

## Installation

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Update your `.env` file with:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 3. Run the Streamlit App

```bash
streamlit run app.py
```

The app will be available at: `http://localhost:8501`

## Features

- **📤 Upload Receipt**: Upload receipt images for automatic analysis
- **🤖 AI Analysis**: Uses Google Gemini Vision API to extract expense data
- **📋 View History**: Browse all recorded expenses with filtering
- **📊 Statistics**: View expense breakdown by category and trends

## File Structure

```
.
├── app.py                  # Main Streamlit application
├── gemini_utils.py         # Gemini API integration
├── db_utils.py             # MongoDB operations
├── parse_utils.py          # Data parsing utilities
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── .streamlit/
    └── config.toml        # Streamlit configuration
```

## API Endpoints (Deprecated)

The Next.js API endpoints are no longer used:
- ~~`POST /api/analyze`~~ → Replaced by `gemini_utils.analyze_receipt_image()`
- ~~`POST /api/expenses`~~ → Replaced by `db_utils.save_expense()`
- ~~`GET /api/expenses`~~ → Replaced by `db_utils.get_all_expenses()`

## Troubleshooting

### Issue: "API Quota Exceeded"
- Check your Gemini API quota at [ai.dev/rate-limit](https://ai.dev/rate-limit)
- Switch to a paid plan for higher limits

### Issue: "MongoDB Connection Failed"
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure database user has proper permissions

### Issue: "Streamlit not found"
```bash
pip install streamlit
```

## Deployment

### Deploy to Streamlit Cloud

1. Push your code to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Click "New app"
4. Select your repository and `app.py`
5. Add secrets (`.env` variables) in the app settings

### Deploy to Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["streamlit", "run", "app.py"]
```

Run:
```bash
docker build -t expense-tracker .
docker run -p 8501:8501 -e NEXT_PUBLIC_GEMINI_API_KEY=your_key -e MONGODB_URI=your_uri expense-tracker
```

## Configuration

Edit `.streamlit/config.toml` to customize:
- Theme colors
- Layout and sidebar behavior
- Server settings

## Performance Tips

1. **Image Optimization**: App automatically compresses images before sending to API
2. **Caching**: MongoDB connections are cached using Streamlit's `@st.cache_resource`
3. **Lazy Loading**: Expenses are loaded on-demand only when viewing history

## Security Notes

- API keys are stored in `.env` and never committed to git
- `NEXT_PUBLIC_GEMINI_API_KEY` will be visible in frontend (intended for Gemini's client-side usage)
- Never expose `MONGODB_URI` in frontend code
- Use environment variables for all sensitive data

## Next Steps

- ✅ Test locally with `streamlit run app.py`
- ✅ Deploy to Streamlit Cloud for easy hosting
- ✅ Add more categories and filtering options
- ✅ Implement expense export (CSV/PDF)
- ✅ Add multi-language support
