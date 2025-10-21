/**
 * Middleware to check if the user is authenticated and has admin privileges
 */
const isAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized: Authentication required' });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  
  next();
};

module.exports = isAdmin;
