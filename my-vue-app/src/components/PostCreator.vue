<script setup>
import { ref } from 'vue';
import { usePostStore } from '../stores/postStore';

const store = usePostStore();

const header = ref('');
const text = ref('');

const createPost = () => {
  if (header.value.trim() && text.value.trim()) {
    store.addPost(header.value.trim(), text.value.trim());
    header.value = '';
    text.value = '';
  }
};
</script>

<template>
  <div class="post-creator-form">
    <h3>Create a New Post</h3>
    <input
      v-model="header"
      placeholder="Post Header"
      maxlength="80"
    />
    <textarea
      v-model="text"
      placeholder="Post Content"
      rows="4"
    ></textarea>
    <button @click="createPost">Publish Post</button>
  </div>
</template>

<style scoped>
.post-creator-form {
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid #ccc;
    border-radius: 8px;
}
input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>