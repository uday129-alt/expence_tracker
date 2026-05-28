# Quick Start - Streamlit Version

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Or manually:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Configure Environment

Make sure your `.env` file contains:
```
NEXT_PUBLIC_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
MONGODB_URI=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Run the App

```bash
streamlit run app.py
```

The app will open automatically at **http://localhost:8501**

---

## 📱 How to Use

### Upload a Receipt
1. Click **"📤 Upload Receipt"** tab
2. Select an image file (JPG, PNG, WebP)
3. Click **"🔍 Analyze Receipt"**
4. Review the extracted data
5. Click **"💾 Save Expense"** to store it

### View History
1. Click **"📋 View History"** tab
2. Filter by category (optional)
3. Sort by date or amount
4. View all expenses in a clean list

### Check Statistics
1. Click **"📊 Statistics"** tab
2. See total expenses and average
3. View breakdown by category
4. Analyze spending patterns

---

## 🔧 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'streamlit'"
```bash
pip install streamlit
```

### Issue: "GEMINI_API_KEY not found"
- Check `.env` file exists in project root
- Verify the key is set correctly
- Restart the app

### Issue: "MongoDB connection failed"
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas is running
- Verify IP whitelist in MongoDB Atlas includes your IP

### Issue: "API Quota Exceeded"
- The free tier quota is limited
- Check usage at: https://ai.dev/rate-limit
- Switch to a paid Gemini API plan

---

## 📊 Project Structure

```
expence_/
├── app.py                      # Main Streamlit app ⭐
├── gemini_utils.py             # AI analysis
├── db_utils.py                 # Database operations
├── parse_utils.py              # Data parsing
├── requirements.txt            # Python packages
├── .env                        # Configuration
├── .streamlit/
│   └── config.toml            # Streamlit settings
├── setup.bat                   # Windows setup script
├── setup.sh                    # macOS/Linux setup script
└── STREAMLIT_DEPLOYMENT.md    # Full documentation
```

---

## 🌐 Deployment Options

### Option 1: Streamlit Cloud (Free & Easy)
1. Push code to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Deploy from your repo
4. Add secrets in app settings

### Option 2: Heroku
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

### Option 3: Docker
```bash
docker build -t expense-tracker .
docker run -p 8501:8501 expense-tracker
```

### Option 4: Local Network
Share the app on your local network:
```bash
streamlit run app.py --server.address 0.0.0.0
```
Then access via: `http://your_ip:8501`

---

## ✅ What's Different from Next.js Version

| Feature | Next.js | Streamlit |
|---------|---------|-----------|
| **Framework** | React + Next.js | Streamlit (Python) |
| **Language** | TypeScript | Python |
| **Hosting** | Vercel, AWS, etc | Streamlit Cloud, Heroku |
| **API Routes** | `/api/analyze`, `/api/expenses` | Direct Python functions |
| **UI Components** | Custom React | Streamlit built-ins |
| **Database** | Same (MongoDB) | Same (MongoDB) |
| **AI Service** | Same (Gemini) | Same (Gemini) |

---

## 📚 More Resources

- [Streamlit Docs](https://docs.streamlit.io)
- [Google Gemini API](https://ai.google.dev)
- [MongoDB Python Driver](https://pymongo.readthedocs.io)
- [Streamlit Cloud](https://streamlit.io/cloud)

---

## ❓ FAQ

**Q: Can I use the old Next.js version?**
A: Yes, all old files are still there. Just run `npm run dev` instead.

**Q: Is my MongoDB data safe?**
A: Yes, both versions use the same database. Data is identical.

**Q: Can I run both versions simultaneously?**
A: Yes, Next.js on port 3000, Streamlit on port 8501.

**Q: How much does it cost?**
A: Streamlit Cloud is free. Gemini API and MongoDB have free tiers.

**Q: Can I customize the UI?**
A: Yes, edit `app.py` and the CSS in the `st.markdown()` calls.

---

Happy tracking! 💰
