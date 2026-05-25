# Deployment Guide for Vercel

This guide will help you deploy the AI Expense Tracker to Vercel.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (free at [vercel.com](https://vercel.com))
- Google Gemini API key
- MongoDB Atlas connection string

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

Make sure `.env.local` is in `.gitignore` (it should be by default).

### 2. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose GitHub login
4. Authorize Vercel to access your GitHub account

### 3. Import Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Find your repository (expence_)
4. Click "Import"

### 4. Configure Environment Variables

On the "Configure Project" screen, add your environment variables:

**Variable 1:**
- Name: `NEXT_PUBLIC_GEMINI_API_KEY`
- Value: `your_gemini_api_key`

**Variable 2:**
- Name: `MONGODB_URI`
- Value: `your_mongodb_connection_string`

⚠️ **Important Notes:**
- `NEXT_PUBLIC_GEMINI_API_KEY` will be exposed to the frontend (this is intentional for Gemini's client-side usage)
- `MONGODB_URI` is server-side only and secure
- Never commit these to version control

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Once complete, you'll get a deployment URL

### 6. Verify Deployment

1. Click "Visit" to open your deployed app
2. Test the following:
   - Upload a receipt image
   - Check if Gemini analyzes it correctly
   - Verify data saves to MongoDB
   - Check expense history loads properly

## Post-Deployment Configuration

### Enable Edge Caching (Optional)

In Vercel Dashboard:
1. Go to Project → Settings → Caching
2. Set cache for static assets to 1 year
3. Set cache for API routes to 60 seconds

### Monitor Performance

1. Go to Project → Analytics
2. Monitor response times
3. Check for any errors in Serverless Functions

### Set Up Custom Domain (Optional)

1. Go to Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables on Vercel

### Getting Your Values

**For NEXT_PUBLIC_GEMINI_API_KEY:**
1. Visit [ai.google.dev/api/keys](https://ai.google.dev/api/keys)
2. Create new API key (free)
3. Copy the key

**For MONGODB_URI:**
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Go to your cluster
3. Click "Connect"
4. Select "Connect your application"
5. Copy the connection string
6. Replace `<username>` and `<password>` with your credentials

### Update Variables

To update environment variables after deployment:

1. Go to Project → Settings → Environment Variables
2. Click the variable to edit
3. Update the value
4. Changes take effect on next deployment

## Redeployment

### Automatic Redeployment

Vercel automatically redeploys when you push to main branch:

```bash
git push origin main
```

Your app will be updated within a few minutes.

### Manual Redeployment

1. Go to Project → Deployments
2. Click "..." on any deployment
3. Select "Redeploy"

## Troubleshooting Deployment Issues

### Build Failed

Check the build logs:
1. Go to Project → Deployments
2. Click the failed deployment
3. Check "Build Logs"

Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### Runtime Error

Check the function logs:
1. Go to Project → Functions
2. Click the error function
3. View the error message

### Slow Performance

1. Check Serverless Function duration
2. Optimize MongoDB queries
3. Enable caching where possible

### Database Connection Issues

1. Verify MongoDB Atlas IP whitelist includes Vercel's IPs
2. Test connection string locally first
3. Check MONGODB_URI format

## Monitoring and Logging

### View Logs

1. Go to Project → Logs
2. Filter by Function or Deployment
3. View real-time logs as app runs

### Analytics

1. Go to Project → Analytics
2. Monitor:
   - Request count
   - Response times
   - Error rates
   - Edge requests

### Error Tracking

1. Errors are automatically reported
2. Check "Monitoring" section
3. Set up alerts (Vercel Pro)

## Scaling and Optimization

### Database Optimization

1. Index MongoDB collections:
```javascript
db.expenses.createIndex({ userId: 1, createdAt: -1 })
```

2. Optimize queries to fetch only needed fields

### API Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// In /api/analyze/route.ts
import { Ratelimit } from '@upstash/ratelimit';
```

### Image Optimization

- Vercel automatically optimizes images
- Use Next.js Image component
- Compress images before upload

## Backing Up Data

### MongoDB Backups

1. Go to MongoDB Atlas → Backups
2. Enable automatic backups (enabled by default)
3. Download snapshots as needed

### Export Data

```bash
mongodump --uri="your_mongodb_uri" --out=./backup
```

## Updating the App

### Make Code Changes

1. Make changes locally
2. Test with `npm run dev`
3. Commit changes:

```bash
git add .
git commit -m "Your message"
git push origin main
```

4. Vercel automatically redeploys
5. Check deployment completed successfully

### Update Dependencies

```bash
npm update
npm audit fix
git add .
git commit -m "Update dependencies"
git push origin main
```

## Security Checklist

- ✅ API keys in environment variables
- ✅ `.env.local` in `.gitignore`
- ✅ MongoDB IP whitelist configured
- ✅ HTTPS enforced (Vercel default)
- ✅ CORS properly configured
- ✅ Input validation enabled
- ✅ Rate limiting considered

## Support

For Vercel-specific issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit [Vercel Support](https://vercel.com/support)
- Check deployment logs for detailed errors

For application-specific issues:
- Review the main README.md
- Check API endpoint documentation
- Verify environment variables are set

---

Your app is now deployed and accessible worldwide! 🚀
