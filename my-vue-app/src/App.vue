<template>
  <div id="app">
    <Navbar
      :user="user"
      @open-create-modal="showModal = true"
      @logout="handleLogout"
      @go-to-admin="showAdmin = true"
    />
    
    <div class="app-content">
      <!-- Admin Panel -->
      <AdminPanel 
        v-if="user && showAdmin"
        @back-to-main="showAdmin = false"
      />
      
      <!-- Dashboard for non-authenticated users -->
      <Dashboard v-else-if="!user && !isLoading" />
      
      <!-- Main Unified Dashboard (Two-Column Layout) -->
      <div v-else-if="user && !showAdmin" class="main-container">
        <!-- Left Sidebar: Filters/Navigation -->
        <aside class="sidebar-left">
          <Filters
            :categories="categories"
            :filtered-count="posts.length"
            :total-count="totalPosts"
            @update:search="handleSearchChange"
            @update:category="handleCategoryChange"
            @clear-filters="clearFilters"
          />
        </aside>
        
        <!-- Right Content Area: Posts Feed -->
        <main class="content-area">
          <div v-if="isLoadingPosts" class="loading">
            <div class="loading-spinner"></div>
            <p>Loading posts...</p>
          </div>
          
          <div v-else-if="posts.length === 0" class="empty-state card">
            <p v-if="searchQuery || categoryFilter">No posts match your filters. Try adjusting your search or clear filters.</p>
            <p v-else>💡 Be the first to share an idea! No posts found yet.</p>
          </div>
          
          <section v-else class="posts-grid">
            <PostCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @vote="handleVote"
            />
          </section>
        </main>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
    
    <!-- Footer for feedback -->
    <AppFooter v-if="user && !showAdmin" />
    
    <CreatePostModal
      v-if="showModal"
      :categories="categories"
      @close="showModal = false"
      @submitted="handlePostCreated"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Dashboard from './components/Dashboard.vue'
import Filters from './components/Filters.vue'
import PostCard from './components/PostCard.vue'
import CreatePostModal from './components/CreatePostModal.vue'
import AdminPanel from './components/AdminPanel.vue'
import AppFooter from './components/AppFooter.vue'
import * as api from './services/api'

export default {
  name: 'App',
  components: { Navbar, Dashboard, Filters, PostCard, CreatePostModal, AdminPanel, AppFooter },
  setup() {
    const user = ref(null)
    const posts = ref([])
    const categories = ref([])
    const showModal = ref(false)
    const showAdmin = ref(false)
    const isLoading = ref(true)
    const isLoadingPosts = ref(false)
    const totalPosts = ref(0)
    
    const searchQuery = ref('')
    const categoryFilter = ref('')

    async function checkAuth() {
      try {
        user.value = await api.getMe()
        console.log('Authenticated as:', user.value)
      } catch (e) {
        user.value = null
        console.log('Not authenticated')
      }
    }

    async function fetchCategories() {
      try {
        categories.value = await api.fetchCategories()
      } catch (e) {
        console.error('Failed to fetch categories:', e)
        categories.value = []
      }
    }

    async function fetchPosts() {
      isLoadingPosts.value = true
      try {
        const params = {}
        if (searchQuery.value) params.search = searchQuery.value
        if (categoryFilter.value) params.category = categoryFilter.value
        
        posts.value = await api.fetchPosts(params)
        
        // Store total count when no filters applied
        if (!searchQuery.value && !categoryFilter.value) {
          totalPosts.value = posts.value.length
        }
      } catch (e) {
        console.error('Failed to fetch posts:', e)
        posts.value = []
      } finally {
        isLoadingPosts.value = false
      }
    }

    async function init() {
      isLoading.value = true
      await checkAuth()
      if (user.value) {
        await Promise.all([fetchCategories(), fetchPosts()])
      }
      isLoading.value = false
    }

    onMounted(init)

    function handleSearchChange(value) {
      searchQuery.value = value
      fetchPosts()
    }

    function handleCategoryChange(value) {
      categoryFilter.value = value
      fetchPosts()
    }

    async function handleVote({ id, voteType }) {
      try {
        await api.votePost(id, voteType)
        await fetchPosts()
      } catch (e) {
        console.error('Vote failed:', e)
        alert('Failed to record vote. Please try again.')
      }
    }

    async function handlePostCreated() {
      showModal.value = false
      await fetchPosts()
    }

    async function handleLogout() {
      user.value = null
      posts.value = []
      categories.value = []
      searchQuery.value = ''
      categoryFilter.value = ''
      showAdmin.value = false
      await init()
    }

    function toggleAdminPanel() {
      showAdmin.value = !showAdmin.value
    }

    function clearFilters() {
      searchQuery.value = ''
      categoryFilter.value = ''
      fetchPosts()
    }

    return {
      user,
      posts,
      categories,
      showModal,
      showAdmin,
      isLoading,
      isLoadingPosts,
      totalPosts,
      searchQuery,
      categoryFilter,
      handleSearchChange,
      handleCategoryChange,
      handleVote,
      handlePostCreated,
      handleLogout,
      toggleAdminPanel,
      clearFilters
    }
  }
}
</script>

<style>
/* Global styles are in styles.css */
</style>
