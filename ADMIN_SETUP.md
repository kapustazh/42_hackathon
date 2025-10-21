# Admin Panel Setup Guide

## ✅ Implementation Complete

The admin panel has been fully implemented with:
- 🔒 **Admin middleware** protecting admin routes
- 🌐 **Admin API endpoints** for fetching all posts (including spam)
- 🎨 **AdminPanel Vue component** with spam post display
- 📊 **Grafana dashboard embedding** support
- 🎯 **PeerFinder design system** integration

---

## 🚀 Quick Start: Enable Admin Access

### 1. Login to the Application First
Before setting admin privileges, you need to login at least once:
1. Open http://localhost:5175
2. Click "Login with 42 Intra"
3. Authenticate with your 42 credentials
4. This creates your user record in the database

### 2. Set Admin Privileges in Database

**Option A: Using Docker (Recommended)**
```bash
# Get your 42 Intra ID from the application after login
# Replace <YOUR_42_ID> with your actual ID (visible in navbar after login)

docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c \
  "UPDATE users SET \"isAdmin\" = true WHERE forty_two_id = <YOUR_42_ID>;"
```

**Option B: Using psql directly**
```bash
psql postgres://n8n_user:5zgY6dazbtylhoVF8eeEzgGh@127.0.0.1:5432/whiteboard_db \
  -c "UPDATE users SET \"isAdmin\" = true WHERE forty_two_id = <YOUR_42_ID>;"
```

**Option C: Find your ID first, then update**
```bash
# List all users to find your ID
docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c \
  "SELECT id, forty_two_id, login, \"isAdmin\" FROM users;"

# Then update using the forty_two_id
docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c \
  "UPDATE users SET \"isAdmin\" = true WHERE forty_two_id = <YOUR_42_ID>;"
```

### 3. Refresh the Page
- After setting admin privileges, refresh http://localhost:5175
- You should now see "🔧 Admin" button in the navbar
- Click it to access the admin interface

---

## 📊 Setting Up Grafana Dashboard (Optional)

The admin panel includes an embedded Grafana dashboard. To enable it:

### 1. Start Grafana Container
```bash
docker start hc_grafana
```

**Note:** Grafana runs on port 3001 to avoid conflicts with other applications.

**✅ Grafana is already running on port 3001!** 
- Access it at: **http://localhost:3001**
- Port 3000 is free for other applications

If you need to restart Grafana:
```bash
docker restart hc_grafana
```

To recreate Grafana on a different port:
```bash
# Stop and remove existing container
docker stop hc_grafana && docker rm hc_grafana

# Create new container on desired port
docker run -d \
  --name hc_grafana \
  -p 3001:3000 \
  -v grafana-data:/var/lib/grafana \
  grafana/grafana:latest
```

### 2. Configure Grafana for Embedding

Access Grafana configuration:
```bash
docker exec -it hc_grafana bash
vi /etc/grafana/grafana.ini
```

Find and modify these settings:
```ini
[security]
allow_embedding = true
cookie_samesite = none

[auth.anonymous]
enabled = true
org_role = Viewer
```

Restart Grafana:
```bash
docker restart hc_grafana
```

### 3. Get Dashboard URL

1. Login to Grafana (default: admin/admin) at http://localhost:3001
2. Create or open your monitoring dashboard
3. Click the share icon → Embed
4. Copy the embed URL (should look like: `http://localhost:3001/d/dashboard-id/...&kiosk`)

### 4. Add to Backend Environment

Edit `backend/.env`:
```bash
GRAFANA_EMBED_URL=http://localhost:3001/d/your-dashboard-id?orgId=1&refresh=5s&kiosk
```

Restart the backend:
```bash
cd /root/matvii_database/backend
npm start
```

---

## 🎯 Admin Panel Features

Once logged in as admin, you can:

### ✅ View All Posts
- See both regular posts and spam-flagged posts
- Spam posts show a red counter: `🚩 3` indicating number of reports
- Regular spam icon (🚩) without counter means no reports yet

### ✅ Access Grafana Metrics
- View embedded Grafana dashboard for application metrics
- Monitor:
  - Request rates
  - Response times
  - Error rates
  - Authentication success/failure
  - Vote activity
  - Spam report patterns

### ✅ Admin Navigation
- "🔧 Admin Panel" button appears in navbar for admin users only
- "← Back to Main" button returns to regular post view
- Logout from admin panel works as expected

---

## 🔧 Troubleshooting

### Admin button not showing
1. Verify you're logged in (user icon in navbar)
2. Check database: `docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c "SELECT login, \"isAdmin\" FROM users WHERE forty_two_id = <YOUR_ID>;"`
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors

### Admin panel shows loading forever
1. Check backend logs: `tail -f /tmp/backend.log` (look for errors)
2. Verify admin routes registered: should see no errors on startup
3. Test API endpoint: Use browser dev tools to check network requests

### Grafana iframe not loading
1. Verify `GRAFANA_EMBED_URL` is set in `backend/.env`
2. Check Grafana is running: `docker ps | grep grafana`
3. Test Grafana URL directly in browser
4. Verify embedding is enabled in Grafana config
5. Check browser console for CORS/iframe errors

### Database connection issues
```bash
# Test connection
docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c "SELECT version();"

# Check if users table has isAdmin column
docker exec hc_postgres psql -U n8n_user -d whiteboard_db -c "\d users"
```

---

## 📝 Technical Details

### Database Changes
- Added `isAdmin` boolean field to `users` table (default: false)
- Added index to `forty_two_id` for faster OAuth lookups
- Changes applied automatically with Sequelize `sync({ alter: true })`

### Backend Routes
- `GET /api/admin/posts` - Returns all posts without spam filter (admin only)
- `GET /api/admin/grafana-url` - Returns Grafana embed URL (admin only)
- Both protected by `isAdmin` middleware

### Frontend Components
- `AdminPanel.vue` - Admin interface with spam posts and Grafana embed
- `Navbar.vue` - Shows admin button when `user.isAdmin === true`
- `App.vue` - Routes between main view and admin panel

### Performance Optimizations
- `passport.deserializeUser` uses `findByPk()` (indexed primary key lookup)
- `forty_two_id` has database index for fast OAuth queries
- Session stored in PostgreSQL with 30-day expiry

---

## 🎨 Design Notes

Admin panel follows PeerFinder design system:
- **Card background:** #363738
- **Accent green:** #00babc
- **Primary background:** #1a1a1a
- **Text:** #ffffff, #b0b0b0 (secondary)
- **Emoji icons:** Standard keyboard emojis (👍👎🚩🔧)

---

## 🔐 Security Considerations

1. **Admin Middleware:** All admin routes require authentication AND `isAdmin = true`
2. **Session Management:** Sessions stored securely in PostgreSQL
3. **OAuth Security:** 42 API credentials in `.env` (never committed to git)
4. **Grafana Access:** Consider using Grafana's API key authentication for production
5. **Rate Limiting:** Backend has basic rate limiting on vote/spam endpoints

---

## 📚 Additional Resources

- **Backend API:** Check `backend/src/routes/admin.js` for admin endpoints
- **Frontend Component:** See `my-vue-app/src/components/AdminPanel.vue`
- **Middleware:** Review `backend/src/middleware/isAdmin.js`
- **Main Setup:** Refer to `SETUP_GUIDE.md` for general application setup

---

**Questions or Issues?** Check the browser console and backend logs for detailed error messages.
