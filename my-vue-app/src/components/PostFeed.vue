<script setup>
import { defineProps } from 'vue';
import PostItem from './PostItem.vue';

defineProps({
  posts: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="post-list">
    <PostItem v-for="post in posts" :key="post.id" :post="post" />
    <p v-if="posts.length === 0">No main posts to display.</p>
  </div>
</template>