<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="footer-text">42 Idea v1.0</span>
        <span class="footer-divider">•</span>
        <span class="footer-text">Built for 42 Network</span>
      </div>
      
      <div class="footer-right">
        <a 
          href="https://github.com/kapustazh/42_hackathon/issues/new?labels=bug&template=bug_report.md&title=[BUG]%20" 
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          🐛 Report a Bug
        </a>
        <span class="footer-divider">•</span>
        <a 
          href="https://github.com/kapustazh/42_hackathon/issues/new?labels=enhancement&template=feature_request.md&title=[FEATURE]%20" 
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          💡 Request Feature
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background: var(--bg-panel);
  border-top: 1px solid var(--border-color);
  padding: 16px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-text {
  font-size: 13px;
  color: var(--text-muted);
}

.footer-divider {
  color: var(--border-color);
  font-size: 12px;
}

.footer-link {
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-left,
  .footer-right {
    justify-content: center;
  }
}
</style>
