<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>🔧 Admin Panel</h1>
      <button class="btn-secondary" @click="$emit('back-to-main')">
        ← Back to Main
      </button>
    </div>

    <div class="admin-stats">
      <div class="stat-card card">
        <div class="stat-value">{{ stats.totalPosts }}</div>
        <div class="stat-label">Total Posts</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value">{{ stats.totalUsers }}</div>
        <div class="stat-label">Total Users</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value stat-danger">{{ stats.spammedPosts }}</div>
        <div class="stat-label">Spammed Posts</div>
      </div>
      <div class="stat-card card">
        <div class="stat-value stat-success">{{ stats.adminUsers }}</div>
        <div class="stat-label">Admins</div>
      </div>
    </div>

    <section class="grafana-section">
      <h2>📊 Monitoring Dashboard</h2>
      <div class="grafana-container card">
        <iframe
          v-if="grafanaUrl"
          :src="grafanaUrl"
          class="grafana-iframe"
          frameborder="0"
          title="Grafana Dashboard"
        ></iframe>
        <div v-else class="grafana-loading">
          <p>Grafana dashboard not configured</p>
          <small>Set GRAFANA_EMBED_URL in backend .env</small>
        </div>
      </div>
    </section>

    <section class="spam-section">
      <h2>🚩 Spam Queue ({{ spamPosts.length }} posts with >10 reports)</h2>
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading spam posts...</p>
      </div>
      <div v-else-if="spamPosts.length === 0" class="empty-state card">
        <p>✅ No spammed posts! Everything looks clean.</p>
      </div>
      <div v-else class="spam-posts-grid">
        <article v-for="post in spamPosts" :key="post.id" class="spam-post-card card">
          <div class="spam-post-header">
            <div class="spam-post-content">{{ post.content }}</div>
            <div class="spam-badge">
              🚩 {{ post.spamCount }} reports
            </div>
          </div>
          <div class="spam-post-footer">
            <div class="spam-post-meta">
              <span class="author">By: {{ post.author || 'Unknown' }}</span>
              <span class="date">{{ formatDate(post.createdAt) }}</span>
            </div>
            <div class="spam-post-stats">
              <span>👍 {{ post.likeCount }}</span>
              <span>👎 {{ post.dislikeCount }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="all-posts-section">
      <h2>📝 All Posts ({{ allPosts.length }} total)</h2>
      <div class="posts-grid">
        <PostCard
          v-for="post in allPosts"
          :key="post.id"
          :post="post"
          @vote="handleVote"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import PostCard from './PostCard.vue'
import * as api from '../services/api'

export default {
  name: 'AdminPanel',
  components: { PostCard },
  emits: ['back-to-main'],
  setup() {
    const allPosts = ref([])
    const spamPosts = ref([])
    const grafanaUrl = ref('')
    const isLoading = ref(true)
    const stats = ref({
      totalPosts: 0,
      totalUsers: 0,
      spammedPosts: 0,
      adminUsers: 0
    })

    async function fetchData() {
      isLoading.value = true
      try {
        // Fetch all posts (including spam)
        const postsData = await api.default.get('/admin/posts')
        allPosts.value = postsData.data
        spamPosts.value = postsData.data.filter(p => p.spamCount > 10)

        // Fetch Grafana URL
        try {
          const grafanaData = await api.default.get('/admin/grafana-url')
          grafanaUrl.value = grafanaData.data.url
        } catch (e) {
          console.log('Grafana URL not available:', e.message)
        }

        // Fetch stats
        try {
          const statsData = await api.default.get('/admin/stats')
          stats.value = statsData.data
        } catch (e) {
          console.error('Stats fetch failed:', e)
        }
      } catch (error) {
        console.error('Admin data fetch failed:', error)
        if (error.response?.status === 403) {
          alert('Access denied. Admin privileges required.')
        }
      } finally {
        isLoading.value = false
      }
    }

    async function handleVote({ id, voteType }) {
      try {
        await api.votePost(id, voteType)
        await fetchData() // Refresh data after vote
      } catch (e) {
        console.error('Vote failed:', e)
      }
    }

    function formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    }

    onMounted(fetchData)

    return {
      allPosts,
      spamPosts,
      grafanaUrl,
      isLoading,
      stats,
      handleVote,
      formatDate
    }
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.admin-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  text-align: center;
  padding: 24px;
}

.stat-card:hover {
  transform: none;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--accent-green);
  margin-bottom: 8px;
}

.stat-danger {
  color: var(--danger);
}

.stat-success {
  color: #4caf50;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.grafana-section,
.spam-section,
.all-posts-section {
  margin-bottom: 48px;
}

.grafana-section h2,
.spam-section h2,
.all-posts-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.grafana-container {
  padding: 0;
  overflow: hidden;
}

.grafana-container:hover {
  transform: none;
}

.grafana-iframe {
  width: 100%;
  height: 800px;
  border: none;
}

.grafana-loading {
  padding: 60px;
  text-align: center;
  color: var(--text-muted);
}

.spam-posts-grid {
  display: grid;
  gap: 16px;
}

.spam-post-card {
  border-left: 4px solid var(--danger);
}

.spam-post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.spam-post-content {
  flex: 1;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.spam-badge {
  background: rgba(255, 107, 107, 0.2);
  color: var(--danger);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-left: 16px;
  flex-shrink: 0;
}

.spam-post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.spam-post-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.spam-post-stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.posts-grid {
  display: grid;
  gap: 16px;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .admin-header h1 {
    font-size: 24px;
  }
  
  .grafana-iframe {
    height: 500px;
  }
}
</style>
