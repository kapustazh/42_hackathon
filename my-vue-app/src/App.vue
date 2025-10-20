<script setup>
import { computed } from 'vue';
import { usePostStore } from './stores/postStore';
import TheHeader from './components/TheHeader.vue';
import PostCreator from './components/PostCreator.vue';
import PostFeed from './components/PostFeed.vue';
import SpamQueue from './components/SpamQueue.vue';

const store = usePostStore();

// Computed property to apply the correct CSS class
const themeClass = computed(() => {
  return `theme-${store.designMode}`;
});
</script>

<template>
  <div :class="['app-container', themeClass]">
    <TheHeader />
    <main class="content-wrapper">
      <section class="post-creation">
        <PostCreator />
      </section>

      <div class="feed-and-queue">
        <section class="post-feed">
          <h2>Main Feed</h2>
          <PostFeed :posts="store.mainPosts" />
        </section>

        <section class="moderation-queue">
          <h2>Moderation Queue</h2>
          <SpamQueue />
        </section>
      </div>
    </main>
  </div>
</template>

<style>
/* --- BASE STYLES --- */
.app-container {
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.feed-and-queue {
    display: flex;
    gap: 40px;
}

.post-feed, .moderation-queue {
    flex: 1;
}

/* --- THEME STYLES --- */

/* 1. Light Mode (Default) */
.theme-light {
  background-color: white;
  color: #333;
}

/* 2. Dark Mode (White Text) */
.theme-dark {
  background-color: #333;
  color: white;
}

/* 3. Hacker Mode (Colorful Text) */
.theme-hacker {
  background-color: #0d0d0d;
  color: #00ff00; /* Neon green text */
  font-family: 'Courier New', monospace;
}
.theme-hacker h2 {
    color: #00ffff; /* Cyan header */
}
.theme-hacker .post-item {
    border: 1px solid #00ff00;
}
</style>