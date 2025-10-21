# 🔐 Login Fix - Complete Setup Guide

## ✅ All Issues Fixed!

### Changes Made:

1. ✅ **Frontend Login URLs Updated**
   - LoginButton.vue: `http://188.245.198.116:3001/api/auth/42`
   - Dashboard.vue: `http://188.245.198.116:3001/api/auth/42`

2. ✅ **CORS Configuration**
   - Backend allows: `http://188.245.198.116:5173`
   - Backend allows: `http://188.245.198.116:3001`
   - Credentials enabled: `true`

3. ✅ **Session Cookies**
   - `secure: false` (for HTTP)
   - `sameSite: 'lax'` (allows cross-site navigation)
   - `httpOnly: true` (security)

4. ✅ **Backend OAuth Callback**
   - Configured: `http://188.245.198.116:3001/api/auth/42/callback`

---

## ⚠️ CRITICAL: Update 42 OAuth Application

**You MUST update your 42 Intra OAuth application settings:**

1. Go to: **https://profile.intra.42.fr/oauth/applications**
2. Find your application (Client ID: `u-s4t2ud-41bfd3ace8e6ff1ad0334cf2106459187c2910d19435f50101fbaaf8595726af`)
3. Click **Edit**
4. Update the **Redirect URI** to:
   ```
   http://188.245.198.116:3001/api/auth/42/callback
   ```
5. Click **Save**

**Without this step, login will fail with "redirect_uri mismatch" error!**

---

## 🧪 Test Login

1. Open: **http://188.245.198.116:5173**
2. Click "Login with 42 Intra"
3. You should be redirected to 42 Intra login
4. After login, you'll be redirected back to the app

---

## 🔍 Troubleshooting

### If login still fails:

#### Check Browser Console (F12)
Look for errors like:
- `CORS error` → Backend CORS issue (already fixed)
- `redirect_uri_mismatch` → 42 OAuth not updated (see above)
- `Network error` → Backend not running

#### Check Backend Logs
```bash
tail -f /tmp/backend.log
```
Look for:
- `42 OAuth strategy configured successfully` ✅
- `Server listening on http://localhost:3001` ✅

#### Verify Services Running
```bash
# Check backend
curl http://188.245.198.116:3001/api/auth/42
# Should return: 302 redirect to 42 Intra

# Check frontend
curl -I http://188.245.198.116:5173
# Should return: 200 OK
```

#### Test OAuth Callback Directly
```bash
# This should redirect to 42 Intra login
curl -I http://188.245.198.116:3001/api/auth/42
```

---

## 📋 Current Configuration

### Frontend
- **URL**: http://188.245.198.116:5173
- **Login Button**: Points to `http://188.245.198.116:3001/api/auth/42`
- **API Base**: `http://188.245.198.116:3001/api` (from .env.development)

### Backend
- **URL**: http://188.245.198.116:3001
- **OAuth Login**: `/api/auth/42`
- **OAuth Callback**: `/api/auth/42/callback`
- **Session Store**: PostgreSQL
- **Cookies**: HTTP-compatible (secure: false)

### 42 OAuth
- **Client ID**: `u-s4t2ud-41bfd3ace8e6ff1ad0334cf2106459187c2910d19435f50101fbaaf8595726af`
- **Callback URL**: `http://188.245.198.116:3001/api/auth/42/callback` ⚠️ **MUST UPDATE ON 42 INTRA**

---

## 🎯 Quick Test Commands

```bash
# 1. Check if backend is running
curl -I http://188.245.198.116:3001/api/auth/42

# 2. Check if frontend is accessible
curl -I http://188.245.198.116:5173

# 3. Check backend logs for errors
tail -20 /tmp/backend.log

# 4. Restart backend if needed
pkill -f "node.*index.js"
cd /root/matvii_database/backend
nohup npm start > /tmp/backend.log 2>&1 &

# 5. Check frontend (should auto-reload)
# Visit: http://188.245.198.116:5173
```

---

## 🔐 Login Flow

1. User clicks "Login with 42 Intra" on frontend
2. Browser navigates to: `http://188.245.198.116:3001/api/auth/42`
3. Backend redirects to 42 Intra OAuth page
4. User logs in on 42 Intra
5. 42 Intra redirects back to: `http://188.245.198.116:3001/api/auth/42/callback`
6. Backend validates OAuth token
7. Backend creates session and sets cookie
8. Backend redirects to: `http://188.245.198.116:5173`
9. Frontend checks session via `/api/auth/status`
10. User is logged in! 🎉

---

## 📝 Remember

- ✅ Frontend updated to use IP address
- ✅ Backend CORS configured
- ✅ Session cookies work with HTTP
- ⚠️ **YOU MUST UPDATE 42 OAUTH REDIRECT URI** (see above)

After updating the 42 OAuth redirect URI, login should work perfectly!
