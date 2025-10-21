<template>
  <div class="container">
    <div style="padding:20px;text-align:center">
      <h2>Server not available (HTTP 418)</h2>
      <p style="color:var(--muted)">The backend is not reachable. Please get yourself a Coffie and try later.</p>
      <div style="margin-top:12px">
        <button class="btn" @click="$emit('retry')">Retry</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['retry'])
</script>
