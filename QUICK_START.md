# 🚀 Quick Start Guide

Get started with AI Expense Tracker in 5 minutes!

## Step 1: Get Your API Keys (2 min)

### Google Gemini API Key (FREE)
1. Go to https://ai.google.dev/api/keys
2. Click **"Create API Key"**
3. Copy the key

### MongoDB Connection String (FREE)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster (M0 tier is free)
3. Click **"Connect"** → **"Connect your application"**
4. Copy connection string
5. Replace `<username>` and `<password>` with your credentials

## Step 2: Configure Environment (1 min)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
MONGODB_URI=your_connection_string_here
```

**Note:** `.env.local` is in `.gitignore` - your secrets are safe!

## Step 3: Start Development Server (1 min)

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Step 4: Test the App (1 min)

1. **Upload Receipt**
   - Click "Start Scanning"
   - Upload a receipt image
   - Watch AI analyze it!

2. **View Results**
   - Extracted data displays
   - Click "Save to History"

3. **Check History**
   - Go to "View History"
   - See your expense
   - Search and filter!

---

## 📝 Essential Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run lint

# Clean install
npm ci
```

---

## 🔗 Important Links

| Link | Purpose |
|------|---------|
| http://localhost:3000 | Home page |
| http://localhost:3000/upload | Upload receipt |
| http://localhost:3000/history | View expenses |
| https://ai.google.dev | Gemini API |
| https://mongodb.com/cloud | MongoDB |

---

## ✅ Verify Setup

Your app is ready if you see:
- ✅ "Ready in 1230ms" in terminal
- ✅ Home page loads at localhost:3000
- ✅ Can upload images
- ✅ Results display correctly

---

## 🐛 Common Issues

### "GEMINI_API_KEY not found"
```bash
# Check .env.local exists
ls .env.local

# Restart dev server
npm run dev
```

### "MongoDB connection failed"
- Verify IP whitelist in MongoDB Atlas
- Check connection string format
- Ensure username:password is correct

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```

---

## 🚀 Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Then:
# 1. Visit vercel.com
# 2. Import your repository
# 3. Add environment variables
# 4. Click Deploy
```

See `DEPLOYMENT.md` for details!

---

## 📖 Full Documentation

- **README.md** - Complete guide
- **DEPLOYMENT.md** - Vercel deployment
- **PROJECT_SUMMARY.md** - What's built
- Code comments - Inline docs

---

## 🎯 Next Steps

1. ✅ Setup `.env.local`
2. ✅ Run `npm run dev`
3. ✅ Test locally
4. ✅ Read full README.md
5. ✅ Deploy to Vercel
6. ✅ Share with friends!

---

**Happy Expense Tracking!** 💰✨

Questions? Check the docs or Google Gemini API docs at https://ai.google.dev
