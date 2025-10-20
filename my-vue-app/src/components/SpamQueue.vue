<script setup>
import { usePostStore } from '../stores/postStore';
import PostItem from './PostItem.vue';

const store = usePostStore();
</script>

<template>
  <div class="spam-queue-container">
    <div class="queue-section">
        <h3>Spam (Needs Review)</h3>
        <PostItem v-for="post in store.spamPosts" :key="post.id" :post="post" />
        <p v-if="store.spamPosts.length === 0">Queue is clear!</p>
    </div>

    <div class="queue-section">
        <h3>In-Work (Claimed)</h3>
        <PostItem v-for="post in store.inWorkPosts" :key="post.id" :post="post" />
        <p v-if="store.inWorkPosts.length === 0">No claimed posts.</p>
    </div>
  </div>
</template>