<template>
  <div class="container">
    <div v-if="messages.length === 0" style="padding:20px;color:var(--muted)">No messages yet.</div>
    <div v-for="m in messages" :key="m.id" class="message">
      <div class="message-row">
        <div>
          <div class="message-title">{{ m.title }}</div>
          <div class="message-body">{{ m.body }}</div>
        </div>
        <div style="text-align:right;color:var(--muted, font-size.12px)">
          <div>ID: {{ m.id }}</div>
          <div>Total: {{ (m.likes||0) + (m.dislikes||0) + (m.spamCount||0) }}</div>
        </div>
      </div>

      <div class="buttons">
        <button class="btn like" @click="doVote(m.id,'like')">👍 Like ({{ m.likes||0 }})</button>
        <button class="btn" @click="doVote(m.id,'dislike')">👎 Dislike ({{ m.dislikes||0 }})</button>
        <button class="btn spam" @click="doVote(m.id,'spam')">🚫 Spam ({{ m.spamCount||0 }})</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vote } from '../services/api'

const props = defineProps({ messages: { type: Array, default: () => [] } })
const emit = defineEmits(['voted','error'])

async function doVote(id, type){
  try {
    const updated = await vote(id, type)
    // emit updated so parent refreshes lists
    emit('voted', updated)
  } catch (err){
    console.error(err)
    emit('error', err.response?.status === 418 ? {code:418} : err.message || 'Network error')
  }
}
</script>
