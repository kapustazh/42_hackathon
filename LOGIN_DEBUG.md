# 🔍 Login Debugging - Current Status

## ✅ What's Working:

1. **Backend is running** on port 3001 ✅
2. **Frontend is running** on port 5173 ✅  
3. **OAuth redirect is working** - redirects to 42 Intra ✅
4. **Login buttons updated** to use `http://188.245.198.116:3001/api/auth/42` ✅
5. **CORS is configured** correctly ✅
6. **Session cookies** configured for HTTP ✅

## 📋 Test Results:

```bash
# Backend OAuth endpoint test:
curl http://188.245.198.116:3001/api/auth/42
# Result: 302 Redirect to https://api.intra.42.fr/oauth/authorize ✅

# The callback URL in the redirect:
http://188.245.198.116:3001/api/auth/42/callback ✅
```

## ⚠️ CRITICAL REQUIREMENT:

**You MUST update your 42 OAuth application settings!**

### Steps to Fix Login:

1. **Go to**: https://profile.intra.42.fr/oauth/applications

2. **Find your application**: 
   - Client ID: `u-s4t2ud-41bfd3ace8e6ff1ad0334cf2106459187c2910d19435f50101fbaaf8595726af`

3. **Click "Edit"**

4. **Update Redirect URI** to:
   ```
   http://188.245.198.116:3001/api/auth/42/callback
   ```
   
5. **Save the changes**

## 🧪 How to Test:

1. Open: http://188.245.198.116:5173
2. Click "Login with 42 Intra"
3. You should see the 42 login page
4. Enter your 42 credentials
5. **If you get "redirect_uri_mismatch" error:**
   - ❌ You haven't updated the 42 OAuth settings yet
   - Go back to step 1 above

6. **If login succeeds:**
   - ✅ You'll be redirected back to http://188.245.198.116:5173
   - ✅ You'll see your posts and can create new ones

## 🐛 Common Issues:

### "redirect_uri_mismatch" error
**Cause:** 42 OAuth app not updated with new callback URL  
**Fix:** Update redirect URI on 42 Intra (see above)

### Stuck on "Loading..."
**Cause:** Frontend can't reach backend  
**Fix:** Check if both services are running:
```bash
# Check backend
curl http://188.245.198.116:3001/api/auth/me
# Should return: 401 (not authenticated) - this is correct

# Check frontend
curl -I http://188.245.198.116:5173
# Should return: 200 OK
```

### CORS errors in browser console
**Cause:** CORS not allowing frontend domain  
**Fix:** Already done - backend allows `http://188.245.198.116:5173`

### Cookies not being set
**Cause:** Secure cookie over HTTP  
**Fix:** Already done - `secure: false` in session config

## 📝 Current Configuration:

**Frontend:**
- URL: http://188.245.198.116:5173
- Login button: http://188.245.198.116:3001/api/auth/42

**Backend:**
- URL: http://188.245.198.116:3001
- OAuth login: /api/auth/42
- OAuth callback: /api/auth/42/callback
- Session: PostgreSQL store with HTTP-safe cookies

**42 OAuth:**
- Client ID: u-s4t2ud-...
- **Required Callback**: http://188.245.198.116:3001/api/auth/42/callback
- ⚠️ **MUST BE UPDATED ON 42 INTRA WEBSITE**

## 🎯 Quick Commands:

```bash
# Restart backend
pkill -f "node.*index.js"
cd /root/matvii_database/backend
nohup npm start > /tmp/backend.log 2>&1 &

# Check backend logs
tail -f /tmp/backend.log

# Test OAuth redirect
curl -I http://188.245.198.116:3001/api/auth/42
# Should return: 302 Found

# Test if you're logged in
curl http://188.245.198.116:3001/api/auth/me
# Returns 401 if not logged in, user data if logged in
```

## 🚀 The Login Flow:

1. Click "Login with 42 Intra" on frontend
2. → Browser goes to: http://188.245.198.116:3001/api/auth/42
3. → Backend redirects to: https://api.intra.42.fr/oauth/authorize?...
4. → You login on 42 Intra
5. → 42 redirects back to: http://188.245.198.116:3001/api/auth/42/callback
6. ⚠️ **IF CALLBACK URL NOT REGISTERED**: Error "redirect_uri_mismatch"
7. ✅ **IF CALLBACK URL REGISTERED**: Backend validates token, creates session
8. → Backend redirects to: http://188.245.198.116:5173
9. → Frontend loads, checks auth with /api/auth/me
10. ✅ You're logged in!

---

**Everything is configured correctly on our end. The only remaining step is updating the 42 OAuth application settings on the 42 Intra website.**
