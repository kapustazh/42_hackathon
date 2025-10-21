# 🎯 Whiteboard App - Quick Start Guide

Get your collaborative whiteboard up and running in 5 minutes!

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL running locally
- A 42 Intra account

---

## 🚀 Quick Start (3 Steps)

### Step 1: Set Up 42 OAuth (2 minutes)

1. Go to https://profile.intra.42.fr/oauth/applications
2. Click **"New Application"**
3. Fill in the form with these values:

   **Required Fields:**
   - **Name**: `Whiteboard Local` (or any unique name you prefer)
   - **Description**: `Collaborative whiteboard for sharing ideas and voting`
   - **Application type**: `Campus Tool`
   - **Website**: `http://localhost:5174` (or use a placeholder)
   - **Public**: ✅ Yes (check this box)
   - **Redirect URI**: `http://localhost:3000/api/auth/42/callback` ⚠️ **Must be exact!**
   - **Scopes**: ✅ Check only "Access the user public data" (first option)

4. Click **"Submit"**
5. **📋 Copy your credentials:**
   - **UID** (Client ID) - you'll need this
   - **Secret** (Client Secret) - you'll need this
6. **Keep this page open** - you'll paste these values in Step 2

### Step 2: Configure & Start Backend (1 minute)

```bash
# Navigate to backend folder
cd /root/matvii_database/backend

# Install dependencies
npm install

# Edit .env file with your 42 OAuth credentials
nano .env
```

**Update these two lines in `.env`:**
```env
FORTY_TWO_CLIENT_ID=paste_your_client_id_here
FORTY_TWO_CLIENT_SECRET=paste_your_client_secret_here
```

**Save and exit** (Ctrl+X, then Y, then Enter)

**Start the backend:**
```bash
npm start
```

✅ You should see: `Server running on http://localhost:3000`

### Step 3: Start Frontend (1 minute)

**Open a NEW terminal** and run:

```bash
# Navigate to frontend folder
cd /root/matvii_database/my-vue-app

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ You should see: `Local: http://localhost:5174`

---

## 🎉 You're Done!

**Open your browser and go to:** http://localhost:5174

You should see:
- A welcome screen with "Login with 42 Intra" button
- Click it to log in
- After login, you can create posts, vote, and use filters!

---

## 🔧 Troubleshooting

### Backend won't start?

**If you see "Port 3000 already in use" or redirected to Grafana:**
```bash
# Stop Grafana (it's using port 3000)
sudo systemctl stop grafana-server
sudo systemctl disable grafana-server
```

**Check PostgreSQL is running:**
```bash
sudo systemctl status postgresql
# If not running:
sudo systemctl start postgresql
```

**PostgreSQL password authentication error?**
```bash
# Option 1: Use postgres without password (local development)
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Option 2: Update .env with correct password
# Edit DATABASE_URL in .env to match your PostgreSQL password
```

**Check if database exists:**
```bash
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='whiteboard_db'"
# If empty, create it:
createdb -U postgres whiteboard_db
```

### Frontend shows "Network Error"?

**Make sure backend is running on port 3000:**
```bash
curl http://localhost:3000/api/auth/me
# Should return: {"error":"Not authenticated"}
```

### Login redirects but doesn't work?

**Check your 42 OAuth settings:**
1. Redirect URI must be **exactly**: `http://localhost:3000/api/auth/42/callback`
2. Make sure you copied the correct Client ID and Secret to `.env`
3. Restart the backend after changing `.env`

---

## 🎨 Features

### ✨ What You Can Do:

- 🔐 **Login with 42 Intra** - Secure OAuth authentication
- ✍️ **Create Posts** - Share ideas with categories
- 🔍 **Search & Filter** - Find posts by content or category
- 👍👎 **Vote** - Like or dislike posts
- 🚩 **Report Spam** - Flag inappropriate content
- 🏷️ **Categories** - Organize posts by topic

### 🎯 Design Features:

- 🌑 **Dark Theme** - Easy on the eyes
- 📱 **Responsive** - Works on mobile and desktop  
- ⚡ **Fast** - Real-time updates
- 🎨 **PeerFinder-Inspired** - Clean, modern UI

---

## 📊 Optional: Monitoring Setup

Want to track metrics? Set up Prometheus and Grafana.

### Quick Prometheus Setup

```bash
# Install Prometheus
sudo apt install prometheus -y

# Copy config
sudo cp /root/matvii_database/backend/monitoring/prometheus.yml /etc/prometheus/prometheus.yml

# Restart
sudo systemctl restart prometheus
```

**Access:** http://localhost:9090

### Quick Grafana Setup

```bash
# Install Grafana
sudo apt-get install -y software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
sudo apt-get update
sudo apt-get install grafana -y

# Start
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

**Access:** http://localhost:3000 (default: admin/admin)

**Import Dashboard:**
1. Login to Grafana
2. Click **+** → **Import**
3. Upload: `/root/matvii_database/backend/monitoring/grafana-dashboard-v2.json`
4. Select Prometheus datasource
5. Click **Import**

---

## 📚 Advanced Info

### Database Tables

The backend automatically creates these tables:
- `users` - User accounts from 42 OAuth
- `session` - Express session storage
- `Post` - Whiteboard posts with categories
- `PostLikes`, `PostDislikes`, `PostSpamReports` - Vote tracking

### API Endpoints

#### Authentication
- `GET /api/auth/42` - Start login flow
- `GET /api/auth/42/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Posts
- `GET /api/posts` - List posts (supports `?search=` and `?category=`)
- `POST /api/posts` - Create post (auth required)
- `POST /api/posts/:id/vote` - Vote on post (auth required)

#### Categories
- `GET /api/categories` - List all categories

### Environment Variables

Default `.env` configuration:
```env
DATABASE_URL=postgres://postgres:20102025@127.0.0.1:5432/whiteboard_db
SESSION_SECRET=your-random-secret-change-in-production
NODE_ENV=development
PORT=3000
FORTY_TWO_CLIENT_ID=your_client_id
FORTY_TWO_CLIENT_SECRET=your_client_secret
FORTY_TWO_CALLBACK_URL=http://localhost:3000/api/auth/42/callback
FRONTEND_URL=http://localhost:5174
```

---

## 🆘 Need Help?

### Common Issues

**"Cannot connect to database"**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l | grep whiteboard_db

# Create database if needed
createdb -U postgres whiteboard_db
```

**"Port 3000 already in use"**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>
```

**"42 OAuth error"**
- Double-check redirect URI is exactly: `http://localhost:3000/api/auth/42/callback`
- Verify Client ID and Secret are correct
- Restart backend after changing `.env`

### Logs

**Backend logs:**
```bash
cd /root/matvii_database/backend
npm start
# Watch console output
```

**Check Prometheus metrics:**
```bash
curl http://localhost:3000/metrics
```

---

## 🎓 What's Next?

Once everything is running:

1. **Test the app** - Create posts, vote, try filters
2. **Explore the code** - Check out the Vue components in `my-vue-app/src/components/`
3. **Customize** - Add new features, change colors, add categories
4. **Monitor** - Set up alerts in Grafana
5. **Deploy** - Ready for production? Update environment variables and deploy!

Enjoy your collaborative whiteboard! 🚀

/*
[MASTER PROMPT - RENAME APPLICATION]

Goal: Rename the application name across all user-facing components.

Action:
1.  Find all instances of the application name "WHITEBOARD".
2.  Replace "WHITEBOARD" with the new name: "42 Idea".

This change must be made in the text content of HTML elements (e.g., <h1>, <title>, etc.) but NOT in class names or variable names unless they explicitly contain "WHITEBOARD" as a name.

Example:
Change: <h1 class="logo">WHITEBOARD</h1>
To: <h1 class="logo">42 Idea</h1>

Ensure this is done for the main application header/logo.
*/