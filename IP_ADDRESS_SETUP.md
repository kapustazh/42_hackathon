# 🌐 Running on IP Address

## Your Server IP: **188.245.198.116**

---

## ✅ Configuration Complete

The following files have been updated to work with your IP address:

1. **Frontend (Vite)**: `my-vue-app/vite.config.js`
   - Now listening on `0.0.0.0` (all network interfaces)

2. **Backend (Express)**: `backend/src/index.js`
   - CORS updated to allow IP address origins

3. **Environment Files**:
   - `my-vue-app/.env.development` - API points to IP
   - `backend/.env` - Callback URL uses IP

---

## 🚀 How to Start

### 1. Start Backend
```bash
cd /root/matvii_database/backend
npm start
```

### 2. Start Frontend
```bash
cd /root/matvii_database/my-vue-app
npm run dev
```

---

## 🌍 Access URLs

### From ANY device on your network:

- **Frontend**: http://188.245.198.116:5173
- **Backend API**: http://188.245.198.116:3000/api
- **Login**: http://188.245.198.116:5173 (click "Login with 42 Intra")

---

## ⚠️ Important: Update 42 OAuth

You need to update your 42 OAuth application:

1. Go to: https://profile.intra.42.fr/oauth/applications
2. Edit your application
3. Add this redirect URI:
   ```
   http://188.245.198.116:3000/api/auth/42/callback
   ```
4. Save

**Without this step, login will fail!**

---

## 🔥 Firewall Check

If you can't access from other devices, check firewall:

```bash
# Allow ports 3000 and 5173
sudo ufw allow 3000/tcp
sudo ufw allow 5173/tcp
sudo ufw status
```

---

## 📱 Test from Another Device

1. Open browser on phone/laptop (same network)
2. Go to: http://188.245.198.116:5173
3. You should see the login page
4. Click "Login with 42 Intra"
5. Authenticate
6. Start using the app!

---

## 🔄 Restart Servers

If servers are already running, restart them:

```bash
# Stop backend (if running with nohup)
pkill -f "node.*index.js"

# Stop frontend
# Press Ctrl+C in the terminal running vite

# Start backend
cd /root/matvii_database/backend
nohup npm start > /tmp/backend.log 2>&1 &

# Start frontend
cd /root/matvii_database/my-vue-app
npm run dev
```

---

## 🐛 Troubleshooting

### Can't access from other devices?
- Check: Firewall allows ports 3000 and 5173
- Check: Both devices on same network
- Check: Server is actually listening on 0.0.0.0

### Login doesn't work?
- Check: 42 OAuth callback URL updated
- Check: Backend .env has correct IP address
- Check: CORS allows the IP origin

### API calls fail?
- Check: Frontend .env.development has correct API URL
- Check: Backend is running (visit http://188.245.198.116:3000/api/health)
- Check: No CORS errors in browser console

---

## 📝 Notes

- This works on your **local network** only
- For internet access, you need a public IP or domain
- For production, use HTTPS and proper domain names
- See DEPLOYMENT.md for public deployment guide

---

## 🎯 Quick Commands

```bash
# Get your IP address
hostname -I | awk '{print $1}'

# Check if backend is running
curl http://188.245.198.116:3000/api/health

# Check backend logs
tail -f /tmp/backend.log

# Test from command line
curl http://188.245.198.116:5173
```

---

**Your app is now accessible from any device on your network!** 🎉
