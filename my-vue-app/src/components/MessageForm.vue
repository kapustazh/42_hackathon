<template>
  <div class="container">
    <div class="form">
      <input v-model="title" placeholder="Header / Title" />
      <textarea v-model="body" rows="5" placeholder="Body text"></textarea>
      <div class="actions">
        <button class="btn" @click="onClear">Clear</button>
        <button class="btn" @click="onSubmit">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createMessage } from '../services/api'

const title = ref('')
const body = ref('')
const emit = defineEmits(['created','error'])

function onClear(){ title.value=''; body.value='' }

async function onSubmit(){
  if (!title.value.trim() || !body.value.trim()){
    emit('error', 'Please provide title and body')
    return
  }
  try {
    const payload = { title: title.value.trim(), body: body.value.trim() }
    const created = await createMessage(payload)
    title.value=''; body.value=''
    emit('created', created)
  } catch (err){
    console.error(err)
    emit('error', err.response?.status === 418 ? {code:418} : err.message || 'Network error')
  }
}
</script>
