<template>
  <div class="banner" :aria-hidden="false">
    <div class="banner-left">
      <div class="logo">MessageHub</div>
      <div class="tabs" role="tablist">
        <button
          class="tab"
          :class="{ active: active === 'create' }"
          @click="$emit('change-tab','create')"
        >Create</button>
        <button
          class="tab"
          :class="{ active: active === 'messages' }"
          @click="$emit('change-tab','messages')"
        >Messages</button>
        <button
          class="tab"
          :class="{ active: active === 'spam' }"
          @click="$emit('change-tab','spam')"
        >Spam</button>
      </div>
    </div>

    <div class="controls">
      <div class="toggle" role="button" @click="toggleTheme">
        {{ themeLabel }}
      </div>
      <div style="font-size:12px;color:var(--muted)">Status: <strong>{{ status }}</strong></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ active: { type: String, default: 'create' }, status: { type: String, default: 'OK' }})
const emit = defineEmits(['change-tab','update:theme'])

const theme = localStorage.getItem('theme') || 'light'
if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark')
else document.documentElement.removeAttribute('data-theme')

function toggleTheme(){
  const t = (document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark'
  if (t === 'dark') document.documentElement.setAttribute('data-theme','dark')
  else document.documentElement.removeAttribute('data-theme')
  localStorage.setItem('theme', t)
  emit('update:theme', t)
}

const themeLabel = computed(()=> (document.documentElement.getAttribute('data-theme') === 'dark') ? 'Dark' : 'Light')
</script>
