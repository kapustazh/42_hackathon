# 🚀 Production Deployment Guide - 42 Idea

Complete guide to deploy the 42 Idea application to production for user testing.

---

## 📋 Table of Contents
1. [Frontend Deployment](#frontend-deployment)
2. [Backend Deployment](#backend-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Checklist](#post-deployment-checklist)
5. [User Testing Guide](#user-testing-guide)

---

## 🎨 Frontend Deployment

### Option A: Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ GitHub integration with auto-deploy
- ✅ Zero configuration for Vite/Vue projects

**Steps:**

1. **Prepare the repository**
   ```bash
   cd /root/matvii_database
   git add my-vue-app/
   git commit -m "Prepare frontend for production"
   git push origin my-feature-branch
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository: `kapustazh/42_hackathon`
   - Configure build settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `my-vue-app`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   
3. **Set Environment Variables** in Vercel Dashboard:
   ```
   VITE_API_BASE=https://your-backend-url.com/api
   VITE_APP_NAME=42 Idea
   VITE_ENVIRONMENT=production
   ```

4. **Deploy!**
   - Click "Deploy"
   - Your frontend will be live at `https://your-project.vercel.app`

### Option B: Netlify

**Steps:**

1. **Install Netlify CLI** (optional)
   ```bash
   npm install -g netlify-cli
   ```

2. **Build locally**
   ```bash
   cd /root/matvii_database/my-vue-app
   npm run build
   ```

3. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder
   - OR connect GitHub for auto-deploy

4. **Configure**
   - Set environment variables in Netlify dashboard
   - Enable HTTPS (automatic)

### Option C: GitHub Pages

**Steps:**

1. **Add homepage to package.json**
   ```json
   {
     "homepage": "https://kapustazh.github.io/42_hackathon"
   }
   ```

2. **Install gh-pages**
   ```bash
   cd my-vue-app
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 🔧 Backend Deployment

### Option A: Render (Recommended - Free Tier)

**Why Render?**
- ✅ Free tier with PostgreSQL included
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Built-in PostgreSQL database

**Steps:**

1. **Create `render.yaml` in backend directory**
   ```yaml
   services:
     - type: web
       name: 42-idea-backend
       env: node
       region: oregon
       plan: free
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 3000
   
   databases:
     - name: 42-idea-db
       plan: free
       databaseName: whiteboard_db
       user: whiteboard_user
   ```

2. **Update backend/.env for production**
   ```env
   NODE_ENV=production
   DATABASE_URL=<provided-by-render>
   SESSION_SECRET=<generate-strong-random-string>
   FORTY_TWO_CLIENT_ID=<your-42-client-id>
   FORTY_TWO_CLIENT_SECRET=<your-42-client-secret>
   FORTY_TWO_CALLBACK_URL=https://your-backend.onrender.com/api/auth/42/callback
   FRONTEND_URL=https://your-frontend.vercel.app
   PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app
   ```

3. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect repository: `kapustazh/42_hackathon`
   - Configure:
     - **Name**: 42-idea-backend
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add all environment variables from step 2
   - Click "Create Web Service"

4. **Setup PostgreSQL**
   - In Render dashboard, create a new PostgreSQL database
   - Copy the "Internal Database URL"
   - Update `DATABASE_URL` environment variable in your web service

### Option B: Heroku

**Steps:**

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login and create app**
   ```bash
   cd /root/matvii_database/backend
   heroku login
   heroku create 42-idea-backend
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FORTY_TWO_CLIENT_ID=your-client-id
   heroku config:set FORTY_TWO_CLIENT_SECRET=your-secret
   heroku config:set SESSION_SECRET=$(openssl rand -hex 32)
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**
   ```bash
   git push heroku my-feature-branch:main
   ```

### Option C: Railway

**Steps:**

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub repository**
3. **Configure**:
   - Root directory: `backend`
   - Start command: `npm start`
4. **Add PostgreSQL database** from Railway's plugin marketplace
5. **Set environment variables** in Railway dashboard
6. **Deploy automatically on push**

---

## 🔐 Environment Configuration

### Frontend Environment Variables

Update `/root/matvii_database/my-vue-app/.env.production`:

```env
VITE_API_BASE=https://your-backend.onrender.com/api
VITE_APP_NAME=42 Idea
VITE_ENVIRONMENT=production
```

### Backend Environment Variables

Required variables for production:

```env
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/whiteboard_db

# Session
SESSION_SECRET=<generate-with: openssl rand -hex 32>

# 42 OAuth
FORTY_TWO_CLIENT_ID=u-s4t2ud-41bfd3ace8e6ff1ad0334cf2106459187c2910d19435f50101fbaaf8595726af
FORTY_TWO_CLIENT_SECRET=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
FORTY_TWO_CALLBACK_URL=https://your-backend-url.com/api/auth/42/callback

# Frontend URLs (for CORS and redirects)
FRONTEND_URL=https://your-frontend.vercel.app
PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app

# Grafana (Optional)
GRAFANA_EMBED_URL=http://localhost:3001
```

### Important: Update 42 OAuth Redirect URI

1. Go to [42 Intra OAuth Applications](https://profile.intra.42.fr/oauth/applications)
2. Edit your application
3. Add production callback URL: `https://your-backend-url.com/api/auth/42/callback`
4. Save changes

---

## ✅ Post-Deployment Checklist

### Before Going Live

- [ ] **Build succeeds**: `cd my-vue-app && npm run build`
- [ ] **Backend starts**: `cd backend && npm start`
- [ ] **Database connected**: Check backend logs
- [ ] **Environment variables set**: All required vars configured
- [ ] **42 OAuth configured**: Callback URL updated on 42 Intra
- [ ] **CORS configured**: Frontend URL in backend whitelist
- [ ] **HTTPS enabled**: Both frontend and backend use HTTPS

### After Deployment

- [ ] **Frontend loads**: Visit your Vercel/Netlify URL
- [ ] **API calls work**: Check browser Network tab
- [ ] **Login works**: Test 42 OAuth flow
- [ ] **Create post works**: Test post creation
- [ ] **Voting works**: Test like/dislike/spam
- [ ] **Filters work**: Test search and categories
- [ ] **Logout works**: Test logout functionality

### Monitoring

```bash
# Frontend (Vercel/Netlify)
- Check deployment logs in dashboard
- Monitor function execution (if applicable)

# Backend (Render/Heroku)
- View logs: render logs -t (or heroku logs --tail)
- Monitor database: Check PostgreSQL dashboard
- Check error tracking
```

---

## 🧪 User Testing Guide

### Test Cases for Beta Users

Create a testing checklist for users:

**Basic Functionality:**
- [ ] Can access the website at [your-url]
- [ ] Can see the login page
- [ ] Can click "Login with 42 Intra"
- [ ] Successfully authenticates with 42 credentials
- [ ] Redirected back to main page after login
- [ ] Can see existing posts
- [ ] Username appears in navbar

**Post Management:**
- [ ] Can click "✍️ New Post" button
- [ ] Modal opens for creating a post
- [ ] Can type content in the text area
- [ ] Can select categories (if available)
- [ ] Can submit the post
- [ ] New post appears in the feed
- [ ] Posts are anonymous (no usernames visible on cards)

**Voting System:**
- [ ] Can click 👍 (like) button
- [ ] Like count increases
- [ ] Can click 👎 (dislike) button
- [ ] Dislike count increases
- [ ] Can click 🚩 (spam) button
- [ ] Spam report is recorded

**Filtering:**
- [ ] Can type in search box
- [ ] Posts filter as you type
- [ ] Can select a category from dropdown
- [ ] Posts filter by category
- [ ] Can click "Clear All Filters"
- [ ] All posts reappear
- [ ] Counter shows "X / Y posts"

**Logout:**
- [ ] Can click "Logout" button
- [ ] Successfully logged out
- [ ] Redirected to login page
- [ ] Can log back in

### Feedback Mechanism

**Option A: Google Forms**

Create a Google Form with these questions:
- What feature were you testing?
- Did it work as expected? (Yes/No)
- If no, what happened?
- Browser and device used
- Screenshot (optional upload)

**Option B: GitHub Issues**

Add a footer link in your app:

```vue
<!-- Add to App.vue -->
<footer class="app-footer">
  <a 
    href="https://github.com/kapustazh/42_hackathon/issues/new?template=bug_report.md" 
    target="_blank"
    class="feedback-link"
  >
    🐛 Report a Bug
  </a>
</footer>
```

**Option C: Simple Email**

Add this to the footer:
```vue
<a href="mailto:your-email@example.com?subject=42 Idea Bug Report">
  📧 Report an Issue
</a>
```

---

## 🚦 Quick Start Commands

### Local Build Test
```bash
# Frontend
cd /root/matvii_database/my-vue-app
npm run build
npm run preview  # Test production build locally

# Backend
cd /root/matvii_database/backend
NODE_ENV=production npm start
```

### Deploy to Vercel (Frontend)
```bash
cd /root/matvii_database/my-vue-app
npx vercel --prod
```

### Deploy to Render (Backend)
```bash
# Push to GitHub
git add backend/
git commit -m "Production ready backend"
git push origin my-feature-branch

# Render will auto-deploy from GitHub
```

---

## 📊 Success Metrics

Track these for user testing:

- **User Engagement**: How many posts are created?
- **Authentication Success**: Login completion rate
- **Feature Usage**: Which features are used most?
- **Bug Reports**: Types and frequency of issues
- **Performance**: Page load times, API response times

---

## 🆘 Troubleshooting

### Frontend doesn't load
- Check Vercel/Netlify deployment logs
- Verify build succeeded
- Check browser console for errors

### API calls fail
- Check CORS configuration
- Verify `VITE_API_BASE` is set correctly
- Check Network tab in browser dev tools
- Verify backend is running

### Login doesn't work
- Check 42 OAuth callback URL is correct
- Verify `FORTY_TWO_CALLBACK_URL` matches 42 Intra settings
- Check session secret is set
- Verify database connection

### Posts don't appear
- Check backend logs for database errors
- Verify API endpoint: `curl https://your-backend/api/posts`
- Check if user is authenticated

---

## 📞 Support

For deployment help:
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Vue Deployment**: https://vuejs.org/guide/best-practices/production-deployment.html

---

**Ready to deploy!** Follow the steps above and your application will be live for user testing. 🚀
