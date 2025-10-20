import { defineStore } from 'pinia';

// Helper to generate unique IDs
let postId = 0;

export const usePostStore = defineStore('post', {
  state: () => ({
    // The three design modes
    designMode: 'light', // 'light', 'dark', 'hacker'

    // Main array for regular posts
    mainPosts: [
      { id: ++postId, header: 'Welcome to the Site', text: 'Use the buttons to change the design mode!', likes: 5, status: 'main' },
    ],

    // Array for spam/in-work posts
    moderationQueue: [],
  }),

  // Getters to organize posts for display
  getters: {
    spamPosts: (state) => state.moderationQueue.filter(p => p.status === 'spam'),
    inWorkPosts: (state) => state.moderationQueue.filter(p => p.status === 'in-work'),
  },

  actions: {
    // 1. Create a new post
    addPost(header, text) {
      const newPost = {
        id: ++postId,
        header,
        text,
        likes: 0,
        status: 'main' // default status
      };
      this.mainPosts.unshift(newPost); // Add to the beginning
      // **DATABASE NOTE**: This is where you would call your backend API to save the new post.
    },

    // 2. Report/Spam a post (move it to the moderation queue)
    reportPost(postId) {
      const index = this.mainPosts.findIndex(p => p.id === postId);
      if (index !== -1) {
        const post = this.mainPosts.splice(index, 1)[0]; // Remove from mainPosts
        post.status = 'spam';
        this.moderationQueue.push(post); // Add to moderation queue
        // **DATABASE NOTE**: Update the post's status in the database.
      }
    },

    // 3. Move a spam post to 'In-Work' status
    claimPost(postId) {
      const post = this.moderationQueue.find(p => p.id === postId);
      if (post) {
        post.status = 'in-work';
        // **DATABASE NOTE**: Update the post's status in the database.
      }
    },

    // 4. Change the design mode
    toggleDesignMode(mode) {
      this.designMode = mode;
    },

    // 5. Like/Dislike (simple example)
    likePost(postId, type) {
        const post = this.mainPosts.find(p => p.id === postId);
        if (post) {
            post.likes += (type === 'like' ? 1 : -1);
            // **DATABASE NOTE**: Update the post's like count.
        }
    }
  }
});