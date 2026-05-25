# Expense Tracker - Next.js & Streamlit Versions

This project now supports **two deployment options**:

1. **Streamlit** (Python) - Recommended for quick deployment
2. **Next.js** (TypeScript/React) - Original version, still available

---

## 🚀 Quick Start

### Option A: Streamlit (Recommended)

**Fastest way to deploy**

```bash
# 1. Run setup script
setup.bat          # Windows
bash setup.sh      # macOS/Linux

# 2. Run the app
streamlit run app.py
```

Opens at: **http://localhost:8501**

📖 **Guide:** Read [STREAMLIT_QUICKSTART.md](STREAMLIT_QUICKSTART.md)

---

### Option B: Next.js (Original)

**If you prefer React/TypeScript**

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables in .env.local
NEXT_PUBLIC_GEMINI_API_KEY=your_key
MONGODB_URI=your_mongodb_uri

# 3. Run development server
npm run dev
```

Opens at: **http://localhost:3000**

📖 **Guide:** Read [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📊 Comparison

| Feature | Streamlit | Next.js |
|---------|-----------|---------|
| **Language** | Python | TypeScript/React |
| **Learning Curve** | ⭐ Easy | ⭐⭐ Medium |
| **Setup Time** | ⭐ ~5 min | ⭐⭐ ~10 min |
| **Deployment** | ⭐ Streamlit Cloud | ⭐⭐ Vercel, AWS |
| **Performance** | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| **Customization** | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| **UI Components** | Built-in | Custom/TailwindCSS |

---

## 📁 Project Structure

```
expence_/
│
├── 📦 Streamlit Version (New)
│   ├── app.py                          # Main Streamlit app
│   ├── gemini_utils.py                 # AI analysis
│   ├── db_utils.py                     # Database ops
│   ├── parse_utils.py                  # Data parsing
│   ├── requirements.txt                # Python packages
│   ├── setup.bat & setup.sh            # Setup scripts
│   ├── STREAMLIT_QUICKSTART.md         # Quick start
│   └── STREAMLIT_DEPLOYMENT.md         # Full guide
│
├── 📦 Next.js Version (Original)
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/                # Gemini analysis API
│   │   │   └── expenses/               # Database operations API
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ExpenseCard.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ToastProvider.tsx
│   ├── lib/
│   │   ├── gemini.ts                   # Gemini integration
│   │   └── mongodb.ts                  # Database connection
│   ├── models/
│   │   └── Expense.ts                  # MongoDB schema
│   ├── utils/
│   │   └── parseExpenseData.ts         # Data parsing
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── tailwind.config.mjs
│
├── 📄 Shared Configuration
│   ├── .env                            # Environment variables
│   ├── .env.example                    # Template
│   ├── README.md                       # This file
│   ├── PROJECT_SUMMARY.md
│   └── DELIVERABLES.md
```

---

## 🔧 Environment Setup

Create a `.env` file in the project root:

```
# Google Gemini API Key - Get from https://ai.google.dev
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyBibPMIOqVHIPelJwM17xeda23pzyMuBNI

# MongoDB Connection - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://23eg110a51_db_user:uday@mydb.rxhnfgg.mongodb.net/
```

---

## 📚 Key Differences

### Streamlit Version
```python
# Simple, Pythonic, quick
from gemini_utils import analyze_receipt_image
from db_utils import save_expense

image = Image.open(uploaded_file)
result = analyze_receipt_image(base64_image)
save_expense(expense_data)
```

### Next.js Version
```typescript
// React components, API routes
const result = await fetch('/api/analyze', { method: 'POST', body: image });
const expenses = await fetch('/api/expenses').then(r => r.json());
```

---

## 🌐 Deployment

### Streamlit Cloud (Recommended for Streamlit)
```bash
git push origin main
# Go to share.streamlit.io and deploy
```

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Docker (Both versions)
```bash
docker build -t expense-tracker .
docker run -p 8501:8501 expense-tracker
```

---

## ✅ Features

Both versions include:
- ✅ Receipt image upload
- ✅ AI-powered expense analysis (Gemini Vision)
- ✅ Automatic data extraction
- ✅ MongoDB persistence
- ✅ Expense history viewing
- ✅ Category filtering
- ✅ Statistics dashboard

---

## 🔗 Resources

### Gemini API
- [Get API Key](https://ai.google.dev)
- [Documentation](https://ai.google.dev/docs)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)

### MongoDB
- [Get Free Cluster](https://www.mongodb.com/cloud/atlas)
- [Python Driver](https://pymongo.readthedocs.io)
- [Documentation](https://docs.mongodb.com)

### Deployment
- [Streamlit Cloud](https://streamlit.io/cloud)
- [Vercel](https://vercel.com)
- [Railway.app](https://railway.app)
- [Heroku](https://www.heroku.com)

---

## 🆘 Troubleshooting

### Problem: "API Quota Exceeded"
**Solution:** Check usage at https://ai.dev/rate-limit and upgrade plan

### Problem: "MongoDB Connection Failed"
**Solution:** 
- Verify credentials in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Problem: "Can't find module X"
**Solution:**
```bash
# Streamlit
pip install -r requirements.txt

# Next.js
npm install
```

---

## 📞 Support

- 📖 Read [STREAMLIT_QUICKSTART.md](STREAMLIT_QUICKSTART.md) for Streamlit help
- 📖 Read [STREAMLIT_DEPLOYMENT.md](STREAMLIT_DEPLOYMENT.md) for detailed Streamlit guide
- 📖 Read [DEPLOYMENT.md](DEPLOYMENT.md) for Next.js help
- 💬 Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for overview

---

## 🎯 Which Version to Choose?

Choose **Streamlit** if you:
- Want quick setup (5 mins)
- Prefer Python
- Need simple deployment
- Are new to web development

Choose **Next.js** if you:
- Want better UI customization
- Need high performance
- Have React/TypeScript experience
- Need enterprise features

---

## 📝 Notes

- Both versions share the same MongoDB database
- Both use the same Gemini API
- You can run both simultaneously (ports 3000 & 8501)
- Next.js files are in `/app`, `/components`, `/lib`, `/models`, `/utils`
- Streamlit files are in project root (`app.py`, `*_utils.py`)

---

Happy tracking! 💰

Made with ❤️ using Gemini AI & MongoDB
