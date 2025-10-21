# Whiteboard Backend

Minimal Express + Sequelize backend for the whiteboard project.

Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `SESSION_SECRET`, and 42 API credentials.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Ensure your PostgreSQL database exists. Example DATABASE_URL:

```
postgres://postgres:password@localhost:5432/whiteboard_db
```

4. Start the server:

```bash
npm start
```

The server will sync models on start (using `sequelize.sync({ alter: true })`).

API Endpoints

- `GET /api/posts` - list posts (spamCount <= 10)
- `POST /api/posts` - create post (authentication required, 1 post per 24h rule)
- `POST /api/posts/:id/vote` - vote (like/dislike/spam) on post (authentication required)
- `GET /api/auth/42` - start 42 OAuth
- `GET /api/auth/42/callback` - 42 OAuth callback
- `GET /api/auth/me` - current user

Monitoring
----------
This backend exposes Prometheus metrics at `/metrics`. To enable basic monitoring:

1. Add a Prometheus target for `http://<host>:3000/metrics`.
2. Import the sample Grafana dashboard located at `monitoring/grafana-dashboard.json`.

Metrics include HTTP request durations and default process metrics collected by `prom-client`.
