<script setup>
import { defineProps } from 'vue';
import { usePostStore } from '../stores/postStore';

const store = usePostStore();

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const report = () => {
  store.reportPost(props.post.id);
};

const claim = () => {
  store.claimPost(props.post.id);
};

const like = () => {
    store.likePost(props.post.id, 'like');
}

const dislike = () => {
    store.likePost(props.post.id, 'dislike');
}

</script>

<template>
  <div class="post-item">
    <h4>{{ post.header }}</h4>
    <p>{{ post.text }}</p>
    <div class="post-meta">
        <span class="status-indicator" :class="post.status">{{ post.status.toUpperCase() }}</span>

        <div v-if="post.status === 'main'" class="main-actions">
            <button @click="like">👍 ({{ post.likes }})</button>
            <button @click="dislike">👎</button>
            <button class="report-btn" @click="report">🚨 Report Spam</button>
        </div>

        <div v-else-if="post.status === 'spam'" class="mod-actions">
            <button @click="claim">🛠️ Claim (Move to In-Work)</button>
        </div>

        <div v-else-if="post.status === 'in-work'" class="mod-actions">
             <button disabled>✅ Under Review</button>
             </div>
    </div>
  </div>
</template>

<style scoped>
.post-item {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.post-item h4 {
    margin-top: 0;
    margin-bottom: 8px;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.main-actions button, .mod-actions button {
    margin-left: 10px;
}

.status-indicator {
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8em;
    font-weight: bold;
}
.status-main {
    background-color: #e6ffe6;
    color: green;
}
.status-spam {
    background-color: #ffcccc;
    color: red;
}
.status-in-work {
    background-color: #ffffcc;
    color: orange;
}
</style>