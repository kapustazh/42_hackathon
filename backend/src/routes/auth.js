const express = require('express');
const router = express.Router();
const passport = require('../passport');

// Login route - redirects to 42 OAuth page
router.get('/42', (req, res, next) => {
  if (!passport._strategy('42')) {
    return res.status(500).json({ error: '42 OAuth strategy not configured. Please set FORTY_TWO_CLIENT_ID and FORTY_TWO_CLIENT_SECRET in .env' });
  }
  passport.authenticate('42')(req, res, next);
});

// Callback route - 42 redirects here after authentication
router.get('/42/callback', (req, res, next) => {
  if (!passport._strategy('42')) {
    return res.status(500).send('42 OAuth strategy not configured');
  }

  passport.authenticate('42', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login-failed`
  }, (err, user) => {
    if (err) {
      console.error('Auth callback error:', err);
      return next(err);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login-failed`);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      // Redirect back to frontend on success
      const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
      console.log('Redirecting after successful login to:', redirectUrl);
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
});

// Check authentication status
router.get('/me', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user.id,
    login: req.user.username,
    intra_id: req.user.forty_two_id
  });
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.json({ ok: true, message: 'Logged out successfully' });
    });
  });
});

module.exports = router;
