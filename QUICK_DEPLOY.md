# 🚀 Quick Deployment Guide

This is a simplified version of DEPLOYMENT.md for getting started quickly.

---

## 🎯 Prerequisites

- GitHub account
- 42 Intra OAuth application credentials
- 30 minutes

---

## ⚡ Fast Track: Deploy in 3 Steps

### Step 1: Deploy Frontend (5 minutes)

**Using Vercel (Easiest)**:

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import: `kapustazh/42_hackathon`
5. Settings:
   - Root Directory: `my-vue-app`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Environment Variables:
   ```
   VITE_API_BASE=https://your-backend.onrender.com/api
   VITE_ENVIRONMENT=production
   ```
7. Click "Deploy"
8. Note your URL: `https://your-app.vercel.app`

### Step 2: Deploy Backend (10 minutes)

**Using Render (Free Tier)**:

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect: `kapustazh/42_hackathon`
5. Settings:
   - Name: `42-idea-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Database:
   - Click "New +" → "PostgreSQL"
   - Copy the Internal Database URL
7. Environment Variables (in web service):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<paste-from-step-6>
   SESSION_SECRET=<generate-random-32-chars>
   FORTY_TWO_CLIENT_ID=u-s4t2ud-41bfd3ace8e6ff1ad0334cf2106459187c2910d19435f50101fbaaf8595726af
   FORTY_TWO_CLIENT_SECRET=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
   FORTY_TWO_CALLBACK_URL=https://your-backend.onrender.com/api/auth/42/callback
   FRONTEND_URL=https://your-app.vercel.app
   PRODUCTION_FRONTEND_URL=https://your-app.vercel.app
   ```
8. Click "Create Web Service"
9. Note your URL: `https://your-backend.onrender.com`

### Step 3: Update URLs (5 minutes)

1. **Update Frontend Environment** (on Vercel):
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Change `VITE_API_BASE` to: `https://your-backend.onrender.com/api`
   - Redeploy

2. **Update 42 OAuth**:
   - Go to https://profile.intra.42.fr/oauth/applications
   - Edit your application
   - Add Redirect URI: `https://your-backend.onrender.com/api/auth/42/callback`
   - Save

---

## ✅ Test Your Deployment

1. Visit: `https://your-app.vercel.app`
2. Click "Login with 42 Intra"
3. Authenticate
4. Create a post
5. Vote on a post

**If everything works: YOU'RE LIVE! 🎉**

---

## 🐛 Common Issues

### "Login doesn't work"
- Check: 42 OAuth callback URL matches backend URL
- Check: Backend environment variables are set

### "API calls fail"
- Check: Frontend `VITE_API_BASE` points to backend
- Check: Backend CORS allows frontend domain
- Check: Backend is running (visit backend URL)

### "Posts don't appear"
- Check: Database is connected (see backend logs)
- Check: User is logged in
- Try: Create a new post first

---

## 📞 Need Help?

See full documentation:
- **Complete Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Testing Guide**: [USER_TESTING_CHECKLIST.md](./USER_TESTING_CHECKLIST.md)
- **Setup Guide**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🎓 What's Next?

1. Share the URL with testers
2. Use the testing checklist
3. Collect feedback via footer links
4. Iterate and improve!

**Your app is live and ready for user testing!** 🚀
