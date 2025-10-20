<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Simple Vue Posts Darkmode</title>
  <style>
    :root {
      --bg: #f4f6fb;
      --card: #ffffff;
      --muted: #6b7280;
      --accent: #2563eb;
      --text: #111;
    }

    [data-theme='dark'] {
      --bg: #1e1e1e;
      --card: #2c2c2c;
      --muted: #9e9e9e;
      --accent: #ff79c6;
      --text: #f8f8f2;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Consolas, monospace;
      margin: 0;
      background: var(--bg);
      color: var(--text);
      transition: background 0.3s, color 0.3s;
    }

    header {
      background: linear-gradient(90deg,#0ea5e9,#7c3aed);
      color: white;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      font-weight: 700;
      font-size: 1.1rem;
    }

    nav {
      display: flex;
      gap: 8px;
    }

    .nav-btn {
      background: transparent;
      border: 2px solid rgba(255,255,255,0.15);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
    }

    .nav-btn.active {
      background: rgba(0,0,0,0.15);
    }

    .container {
      max-width: 1000px;
      margin: 22px auto;
      padding: 0 16px;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .search {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #e6e9ef;
      width: 260px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
      gap: 14px;
    }

    .card {
      background: var(--card);
      padding: 14px;
      border-radius: 12px;
      box-shadow: 0 6px 18px rgba(39,40,45,0.06);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: background 0.3s, color 0.3s;
    }

    .card .meta {
      display: flex;
      justify-content: space-between;
      color: var(--muted);
      font-size: 0.85rem;
    }

    .title {
      font-weight: 600;
      color: var(--accent);
    }

    .body {
      font-size: 0.94rem;
      color: var(--text);
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    button.action {
      flex: 1;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #e6e9ef;
      background: transparent;
      cursor: pointer;
    }

    button.action.like.active {
      border-color: #34d399;
      box-shadow: 0 6px 14px rgba(52,211,153,0.12);
    }

    button.action.dislike.active {
      border-color: #f87171;
      box-shadow: 0 6px 14px rgba(248,113,113,0.12);
    }

    button.spam {
      background: #fdf2f2;
      color: #991b1b;
      border: 1px solid #f5c2c2;
    }

    .empty {
      padding: 40px;
      text-align: center;
      color: var(--muted);
      background: linear-gradient(180deg,#fff,#fbfbfb);
      border-radius: 12px;
    }

    [data-theme='dark'] .empty {
      background: var(--card);
    }

    .top-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .badge {
      background: #111827;
      color: white;
      padding: 6px 8px;
      border-radius: 999px;
      font-size: 0.8rem;
    }

    footer {
      max-width: 1000px;
      margin: 22px auto;
      padding: 14px 16px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    @media (max-width:480px) {
      .controls {
        flex-direction: column;
        gap: 8px;
      }
      .search {
        width: 100%;
      }
    }
  </style>
</head>
<body :data-theme="darkMode ? 'dark' : 'light'">
  <div id="app"></div>

  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <script>
    const { createApp, ref, computed } = Vue;

    createApp({
      setup() {
        const page = ref('main');
        const darkMode = ref(true);

        const posts = ref([
          { id:1, title:'Erster Post', body:'Das ist ein Beispiel-Post. Hier können Inhalte stehen.', likes:2, dislikes:0, spam:false },
          { id:2, title:'Zweiter Post', body:'Noch ein Post. Probier mal like/dislike.', likes:0, dislikes:1, spam:false },
          { id:3, title:'Werbung?', body:'Dieser Post sieht nach Spam aus...', likes:0, dislikes:0, spam:true }
        ]);

        const search = ref('');
        const filtered = computed(() => {
          const q = search.value.trim().toLowerCase();
          return posts.value.filter(p => {
            const matchPage = page.value === 'spam' ? p.spam : !p.spam;
            const matchQuery = q === '' || p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);
            return matchPage && matchQuery;
          });
        });

        function like(post){ post.likes += 1; }
        function dislike(post){ post.dislikes += 1; }
        function toggleSpam(post){ post.spam = !post.spam; }

        const newTitle = ref('');
        const newBody = ref('');
        function addPost() {
          if(!newTitle.value.trim()) return;
          const id = Date.now();
          posts.value.unshift({ id, title:newTitle.value.trim(), body:newBody.value.trim(), likes:0, dislikes:0, spam:false });
          newTitle.value='';
          newBody.value='';
        }

        return { page, posts, filtered, like, dislike, toggleSpam, search, newTitle, newBody, addPost, darkMode };
      },
      template: `
        <header>
          <div class="brand">MyVuePosts</div>
          <nav>
            <button :class="['nav-btn', page==='main' && 'active']" @click="page='main'">Main</button>
            <button :class="['nav-btn', page==='spam' && 'active']" @click="page='spam'">Spam</button>
            <button class="nav-btn" @click="darkMode = !darkMode">{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</button>
          </nav>
        </header>

        <main class="container">
          <div class="controls">
            <div class="top-row">
              <div class="badge">Seite: {{ page === 'main' ? 'Main' : 'Spam' }}</div>
              <input class="search" v-model="search" placeholder="Posts durchsuchen..." />
            </div>
            <div style="display:flex; gap:8px; align-items:center">
              <div style="font-size:0.9rem; color:var(--muted)">Posts: {{ filtered.length }}</div>
            </div>
          </div>

          <section style="margin-bottom:16px">
            <div style="display:flex; gap:8px; flex-wrap:wrap">
              <input v-model="newTitle" placeholder="Titel" style="flex:1; padding:8px 10px; border-radius:8px; border:1px solid #e6e9ef" />
              <input v-model="newBody" placeholder="Inhalt" style="flex:2; padding:8px 10px; border-radius:8px; border:1px solid #e6e9ef" />
              <button @click="addPost" style="padding:8px 12px; border-radius:8px; border:1px solid #e6e9ef; cursor:pointer">Posten</button>
            </div>
          </section>

          <section class="grid">
            <template v-if="filtered.length">
              <article v-for="post in filtered" :key="post.id" class="card">
                <div class="meta">
                  <div class="title">{{ post.title }}</div>
                  <div class="meta">ID {{ post.id }}</div>
                </div>
                <div class="body">{{ post.body }}</div>

                <div class="actions">
                  <button class="action like" :class="{active: false}" @click="like(post)">👍 Like ({{ post.likes }})</button>
                  <button class="action dislike" @click="dislike(post)">👎 Dislike ({{ post.dislikes }})</button>
                  <button class="action spam" @click="toggleSpam(post)">⚠️ {{ post.spam ? 'Als nicht-spam markieren' : 'Als Spam markieren' }}</button>
                </div>
              </article>
            </template>

            <template v-else>
              <div class="empty">Keine Posts gefunden.</div>
            </template>
          </section>
        </main>

        <footer>Einfaches Demo-Frontend mit Darkmode — keine Backend-Anbindung. Zum Verbinden mit einer Datenbank brauchst du ein API-Backend.</footer>
      `
    }).mount('#app');
  </script>
</body>
</html>
