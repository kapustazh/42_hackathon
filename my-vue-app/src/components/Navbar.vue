<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-left">
        <h1 class="logo">42 Idea</h1>
      </div>
      
      <div class="navbar-right">
        <button v-if="user" class="btn-new-post" @click="$emit('open-create-modal')">
          ✍️ New Post
        </button>
        
        <div v-if="user" class="user-status">
          <button v-if="user.isAdmin" class="btn-admin" @click="$emit('go-to-admin')">
            🔧 Admin
          </button>
          <div class="user-info">
            <span class="user-name">{{ user.login }}</span>
            <button class="btn-logout" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import * as api from '../services/api'

export default {
  name: 'Navbar',
  props: {
    user: { type: Object, default: null }
  },
  emits: ['open-create-modal', 'logout', 'go-to-admin'],
  methods: {
    async handleLogout() {
      try {
        await api.logout()
        this.$emit('logout')
      } catch (e) {
        console.error('Logout failed:', e)
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  height: 60px;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent-green);
  letter-spacing: 1px;
  margin: 0;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-new-post {
  background: var(--accent);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-new-post:hover {
  background: #009a9c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
}

.user-status {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.user-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.btn-logout {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  font-weight: 500;
}

.btn-logout:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.btn-admin {
  background: transparent;
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-admin:hover {
  background: var(--accent-green);
  color: white;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 16px;
  }
  
  .logo {
    font-size: 18px;
  }
  
  .user-login {
    display: none;
  }
}
</style>
