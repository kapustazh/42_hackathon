<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <h1 class="dashboard-title">Welcome to the Collaborative Whiteboard</h1>
      <p class="dashboard-subtitle">
        Share your ideas, give feedback, and discover new concepts from your peers.
      </p>
      
      <a href="http://188.245.198.116:3001/api/auth/42" class="btn-login">
        Login with 42 Intra
      </a>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.dashboard {
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(180deg, var(--bg-dashboard) 0%, var(--bg-primary) 100%);
}

.dashboard-content {
  text-align: center;
  max-width: 700px;
}

.dashboard-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
  line-height: 1.2;
}

.dashboard-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  line-height: 1.6;
}

.btn-login {
  display: inline-block;
  background: var(--accent-green);
  color: white;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 186, 188, 0.3);
}

.btn-login:hover {
  background: #009a9c;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 186, 188, 0.4);
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 36px;
  }
  
  .dashboard-subtitle {
    font-size: 16px;
  }
  
  .btn-login {
    padding: 14px 36px;
    font-size: 16px;
  }
}
</style>
