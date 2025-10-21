const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Enable default metrics collection (CPU, memory, etc.)
client.collectDefaultMetrics({
  register,
  timeout: 5000
});

// Custom Metrics

// HTTP Request Counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// HTTP Request Duration Histogram
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000, 2000, 5000],
  registers: [register]
});

// New Posts Counter
const newPostsTotal = new client.Counter({
  name: 'new_posts_total',
  help: 'Total number of posts created',
  registers: [register]
});

// Votes Counter
const votesTotal = new client.Counter({
  name: 'votes_total',
  help: 'Total number of votes cast',
  labelNames: ['vote_type'],
  registers: [register]
});

// Authentication Counter
const authAttemptsTotal = new client.Counter({
  name: 'auth_attempts_total',
  help: 'Total number of authentication attempts',
  labelNames: ['status'],
  registers: [register]
});

// Active Sessions Gauge
const activeSessions = new client.Gauge({
  name: 'active_sessions',
  help: 'Number of active user sessions',
  registers: [register]
});

// Middleware to track HTTP requests
function metricsMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const statusCode = res.statusCode;

    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDurationMs.observe({ method, route, status_code: statusCode }, duration);
  });

  next();
}

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationMs,
  newPostsTotal,
  votesTotal,
  authAttemptsTotal,
  activeSessions,
  metricsMiddleware
};
