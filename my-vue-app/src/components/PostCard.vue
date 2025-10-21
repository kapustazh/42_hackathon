<template>
  <article class="post-card card">
    <div class="post-header">
      <div class="post-content">{{ post.content }}</div>
      <div class="post-date">{{ formatDate(post.createdAt) }}</div>
    </div>
    
    <div class="post-categories" v-if="post.categories && post.categories.length">
      <span v-for="cat in post.categories" :key="cat.id || cat" class="tag">
        {{ typeof cat === 'string' ? cat : cat.name }}
      </span>
    </div>
    
    <div class="post-footer">
      <div class="post-actions">
        <button class="action-btn" @click="vote('like')" :class="{ active: userVote === 'like' }">
          👍 <span class="count">{{ post.likeCount || 0 }}</span>
        </button>
        <button class="action-btn" @click="vote('dislike')" :class="{ active: userVote === 'dislike' }">
          👎 <span class="count">{{ post.dislikeCount || 0 }}</span>
        </button>
        <button class="action-btn spam-btn" @click="vote('spam')" :class="{ active: userVote === 'spam' }">
          🚩
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PostCard',
  props: {
    post: { type: Object, required: true }
  },
  data() {
    return {
      userVote: null // Track user's vote state
    }
  },
  methods: {
    vote(type) {
      this.userVote = type
      this.$emit('vote', { id: this.post.id, voteType: type })
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${months[d.getMonth()]} '${d.getFullYear().toString().slice(-2)}`
    }
  }
}
</script>

<style scoped>
.post-card {
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  margin-bottom: 0;
  transition: all 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border-color: rgba(0, 186, 188, 0.3);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.post-content {
  flex: 1;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--text-primary);
}

.post-date {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.post-categories {
  margin-bottom: 12px;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.post-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.action-btn.active {
  background: rgba(0, 186, 188, 0.1);
  border-color: var(--accent-green);
  color: var(--accent-green);
}

.spam-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}

.spam-btn.active {
  background: rgba(255, 107, 107, 0.1);
  border-color: var(--danger);
  color: var(--danger);
}

.count {
  font-weight: 600;
  font-size: 13px;
}

@media (max-width: 768px) {
  .post-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .post-date {
    align-self: flex-end;
  }
  
  .action-btn {
    padding: 4px 8px;
    font-size: 13px;
  }
}
</style>
