<template>
  <div class="container">
    <div v-if="spam.length === 0" style="padding:20px;color:var(--muted)">No spam messages.</div>
    <div v-for="m in spam" :key="m.id" class="message">
      <div class="message-row">
        <div>
          <div class="message-title">{{ m.title }}</div>
          <div class="message-body">{{ m.body }}</div>
        </div>
        <div style="text-align:right;color:var(--muted)">
          <div>ID: {{ m.id }}</div>
        </div>
      </div>

      <div class="buttons">
        <div style="color:var(--muted)">Spam: {{ m.spamCount||0 }} • Likes: {{ m.likes||0 }} • Dislikes: {{ m.dislikes||0 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ spam: { type: Array, default: () => [] } })
</script>
