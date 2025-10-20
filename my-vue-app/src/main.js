
import { createApp } from 'vue';
import App from './App.vue';
// 1. Import Pinia function
import { createPinia } from 'pinia';

// 2. Create the Vue application instance
const app = createApp(App);

// 3. Create the Pinia store instance
const pinia = createPinia();

// 4. Tell Vue to use Pinia (registers the store globally)
app.use(pinia);

// 5. Mount the application
app.mount('#app');

createApp(App).mount('#app')
