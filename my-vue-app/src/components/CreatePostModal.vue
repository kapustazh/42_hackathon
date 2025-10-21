<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">✕</button>
      
      <h2 class="modal-title">Create New Post</h2>
      
      <div class="form-group">
        <label for="content">Content</label>
        <textarea 
          id="content"
          v-model="content" 
          placeholder="Share your idea..." 
          rows="6"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Categories</label>
        <div class="categories-list">
          <label 
            v-for="cat in categories" 
            :key="cat.id" 
            class="checkbox-label"
          >
            <input 
              type="checkbox" 
              :value="cat.name" 
              v-model="selectedCategories"
            />
            <span>{{ cat.name }}</span>
          </label>
        </div>
        <p class="help-text">Select one or more categories</p>
      </div>
      
      <div class="modal-actions">
        <button class="btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn-primary" @click="submit" :disabled="submitting || !content.trim()">
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
      
      <div class="error-message" v-if="errorMsg">
        ⚠️ {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../services/api'
import { ref } from 'vue'

export default {
  name: 'CreatePostModal',
  props: {
    categories: { type: Array, default: () => [] }
  },
  emits: ['close', 'submitted'],
  setup(props, { emit }) {
    const content = ref('')
    const selectedCategories = ref([])
    const errorMsg = ref('')
    const submitting = ref(false)

    async function submit() {
      if (!content.value.trim()) {
        errorMsg.value = 'Content cannot be empty'
        return
      }

      errorMsg.value = ''
      submitting.value = true
      
      try {
        await api.createPost({ 
          content: content.value,
          categories: selectedCategories.value
        })
        emit('submitted')
        content.value = ''
        selectedCategories.value = []
      } catch (e) {
        if (e?.response?.status === 403) {
          errorMsg.value = e?.response?.data?.message || 'You can only post once per day.'
        } else if (e?.response?.status === 429) {
          errorMsg.value = 'Too many requests. Please wait a moment.'
        } else {
          errorMsg.value = 'Could not create post. Please try again.'
        }
        console.error('Post creation error:', e)
      } finally {
        submitting.value = false
      }
    }

    return { content, selectedCategories, errorMsg, submitting, submit }
  }
}
</script>

<style scoped>
.modal-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-green);
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-label:hover {
  background: var(--hover-bg);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--accent-green);
}

.help-text {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 6px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid var(--danger);
  border-radius: 6px;
  color: var(--danger);
  font-size: 14px;
}

@media (max-width: 768px) {
  .categories-list {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .modal-actions button {
    width: 100%;
  }
}
</style>
