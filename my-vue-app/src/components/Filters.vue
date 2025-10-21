<template>
  <div class="filters-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Filters & Search</h2>
    </div>
    
    <div class="filter-section">
      <label class="filter-label">🔍 Search</label>
      <input
        v-model="localSearch"
        type="search"
        placeholder="Search ideas..."
        class="filter-input"
        @input="onSearchChange"
      />
    </div>
    
    <div class="filter-section">
      <label class="filter-label">🏷️ Category</label>
      <select v-model="localCategory" class="filter-select" @change="onCategoryChange">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>
    </div>
    
    <button class="btn-clear-filters" @click="clearFilters">
      Clear All Filters
    </button>
    
    <div class="filter-stats">
      <div class="stat-item">
        <span class="stat-label">Showing</span>
        <span class="stat-value">{{ filteredCount }}</span>
      </div>
      <div class="stat-divider">/</div>
      <div class="stat-item">
        <span class="stat-label">Total</span>
        <span class="stat-value">{{ totalCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  props: {
    categories: { type: Array, default: () => [] },
    filteredCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 }
  },
  emits: ['update:search', 'update:category', 'clear-filters'],
  data() {
    return {
      localSearch: '',
      localCategory: ''
    }
  },
  methods: {
    onSearchChange() {
      this.$emit('update:search', this.localSearch)
    },
    onCategoryChange() {
      this.$emit('update:category', this.localCategory)
    },
    clearFilters() {
      this.localSearch = ''
      this.localCategory = ''
      this.$emit('clear-filters')
    }
  }
}
</script>

<style scoped>
.filters-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 32px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-input,
.filter-select {
  width: 100%;
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-primary);
}

.filter-input::placeholder {
  color: var(--text-muted);
}

.btn-clear-filters {
  width: 100%;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
  margin-bottom: 24px;
}

.btn-clear-filters:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(0, 186, 188, 0.05);
}

.filter-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-dark);
  border-radius: 8px;
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-top: 4px;
}

.stat-divider {
  font-size: 20px;
  color: var(--border-color);
  font-weight: 300;
}
</style>
