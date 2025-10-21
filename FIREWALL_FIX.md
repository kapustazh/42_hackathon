# 🔥 ERR_CONNECTION_REFUSED - Cloud Firewall Issue

## ⚠️ PROBLEM IDENTIFIED:

**Your cloud provider is blocking incoming connections to ports 3001 and 5173/5174.**

The services ARE running correctly on the server, but external access is blocked by **cloud provider firewall/security groups**.

---

## ✅ What's Working (Internally):

- ✅ Backend running on: `0.0.0.0:3001` (all interfaces)
- ✅ Frontend running on: `0.0.0.0:5174` (Vite dev server)
- ✅ Services accessible from localhost
- ✅ Server firewall (iptables) is open

## ❌ What's Blocked:

- ❌ External access to port 3001 (backend)
- ❌ External access to port 5173/5174 (frontend)
- **Cause**: Cloud provider security groups/firewall

---

## 🔧 FIX: Configure Cloud Provider Firewall

You need to open ports in your **cloud provider's control panel**.

### For Common Providers:

#### **If using OVH/Hetzner/DigitalOcean:**

1. Log into your cloud control panel
2. Go to "Firewall" or "Security Groups"  
3. Add inbound rules to allow:
   - **Port 3001** (TCP) from anywhere (0.0.0.0/0)
   - **Port 5173** (TCP) from anywhere (0.0.0.0/0)
   - **Port 5174** (TCP) from anywhere (0.0.0.0/0)
4. Apply the rules

#### **If using AWS:**
1. EC2 Dashboard → Security Groups
2. Edit inbound rules
3. Add:
   - Type: Custom TCP, Port: 3001, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 5173, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 5174, Source: 0.0.0.0/0

#### **If using Azure:**
1. Virtual Machines → Networking
2. Add inbound port rules for 3001, 5173, 5174

#### **If using Google Cloud:**
1. VPC Network → Firewall rules
2. Create ingress rules for ports 3001, 5173, 5174

---

## 🎯 Current URLs (After Firewall Fix):

- **Frontend**: http://188.245.198.116:5174
- **Backend**: http://188.245.198.116:3001

---

## ✅ Quick Test After Opening Firewall:

```bash
# From your LOCAL machine (not the server):
curl http://188.245.198.116:3001/api/auth/42
# Should return: 302 redirect

curl -I http://188.245.198.116:5174
# Should return: 200 OK
```

---

## 🔄 Alternative: Use SSH Tunnel (Temporary Workaround)

If you can't open firewall ports, use SSH tunneling from your local machine:

```bash
# Run this on YOUR LOCAL computer:
ssh -L 5174:localhost:5174 -L 3001:localhost:3001 root@188.245.198.116

# Then access in browser:
http://localhost:5174
```

---

## 📋 Current Server Status:

```bash
# Services running:
✅ Backend: 0.0.0.0:3001 (PID 125490)
✅ Frontend: 0.0.0.0:5174 (screen session: vite)

# Firewall status:
✅ Server iptables: OPEN (ACCEPT policy)
❌ Cloud provider: BLOCKED (needs configuration)

# Accessible from:
✅ localhost (127.0.0.1) - Works
✅ Server internal IP - Works  
❌ External IP (188.245.198.116) - BLOCKED
```

---

## 🚀 After Firewall is Opened:

### Update Frontend URLs:

Since Vite is now on port 5174, update the login buttons:

1. Edit: `/root/matvii_database/my-vue-app/src/components/LoginButton.vue`
2. Change to: `href="http://188.245.198.116:3001/api/auth/42"`

3. Edit: `backend/.env`
4. Change: `FRONTEND_URL=http://188.245.198.116:5174`

5. Restart backend:
```bash
pkill -f "node.*index.js"
cd /root/matvii_database/backend
nohup npm start > /tmp/backend.log 2>&1 &
```

### Update 42 OAuth:

Go to: https://profile.intra.42.fr/oauth/applications
Update Redirect URI to: `http://188.245.198.116:3001/api/auth/42/callback`

---

## 📞 Need Help?

**You can check your cloud provider's documentation:**

- OVH: Search "firewall rules"
- Hetzner: Cloud Console → Firewall
- DigitalOcean: Networking → Firewalls
- AWS: EC2 Security Groups
- Azure: Network Security Groups
- GCP: VPC Firewall Rules

**The key is to allow inbound TCP traffic on ports 3001 and 5174.**

---

## 🎯 Summary:

**Problem**: Cloud firewall blocking ports
**Solution**: Open ports 3001 and 5174 in cloud control panel
**Then**: Access http://188.245.198.116:5174 in browser
**Login**: Will work after updating 42 OAuth callback URL
