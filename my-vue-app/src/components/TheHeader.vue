<script setup>
import { usePostStore } from '../stores/postStore';

const store = usePostStore();
</script>

<template>
  <header class="top-banner">
    <h1>Vue Post App</h1>
    <nav>
      <button>Home</button>
      <button>About</button>
      <button>Profile</button>

      <div class="design-switches">
        <button
          @click="store.toggleDesignMode('light')"
          :class="{ active: store.designMode === 'light' }"
        >
          ⚪ Light
        </button>
        <button
          @click="store.toggleDesignMode('dark')"
          :class="{ active: store.designMode === 'dark' }"
        >
          ⚫ Dark
        </button>
        <button
          @click="store.toggleDesignMode('hacker')"
          :class="{ active: store.designMode === 'hacker' }"
        >
          🟢 Hacker
        </button>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.top-banner {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color, #ccc);
  background-color: var(--header-bg, #f4f4f4);
}

.app-container.theme-dark .top-banner {
    background-color: #222;
    border-color: #555;
}

.app-container.theme-hacker .top-banner {
    background-color: #000;
    border-color: #00ff00;
}

nav {
  display: flex;
  gap: 15px;
  align-items: center;
}

button {
  padding: 8px 15px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
}
.active {
    border-color: #007bff;
    font-weight: bold;
}
</style>