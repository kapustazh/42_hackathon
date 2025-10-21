const express = require('express');
const router = express.Router();
const { Post, User, Sequelize } = require('../models');
const isAdmin = require('../middleware/isAdmin');

// Get ALL posts (including spam) for admin panel
router.get('/posts', isAdmin, async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'content',
        'authorId',
        'createdAt',
        [
          Sequelize.literal('(SELECT COUNT(*)::int FROM "PostLikes" WHERE "PostLikes"."PostId" = "Post"."id")'),
          'likeCount'
        ],
        [
          Sequelize.literal('(SELECT COUNT(*)::int FROM "PostDislikes" WHERE "PostDislikes"."PostId" = "Post"."id")'),
          'dislikeCount'
        ],
        [
          Sequelize.literal('(SELECT COUNT(*)::int FROM "PostSpamReports" WHERE "PostSpamReports"."PostId" = "Post"."id")'),
          'spamCount'
        ]
      ],
      include: [{
        model: User,
        as: 'author',
        attributes: ['username']
      }],
      // NO having clause - show all posts including spam
      order: [['createdAt', 'DESC']],
      raw: false,
      subQuery: false
    });

    const result = posts.map(p => ({
      id: p.id,
      content: p.content,
      author: p.author ? p.author.username : null,
      likeCount: parseInt(p.dataValues.likeCount, 10) || 0,
      dislikeCount: parseInt(p.dataValues.dislikeCount, 10) || 0,
      spamCount: parseInt(p.dataValues.spamCount, 10) || 0,
      createdAt: p.createdAt
    }));

    res.json(result);
  } catch (error) {
    console.error('Admin posts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch admin posts' });
  }
});

// Get Grafana dashboard URL for embedding
router.get('/grafana-url', isAdmin, (req, res) => {
  const grafanaUrl = process.env.GRAFANA_EMBED_URL || 'http://localhost:3001';
  
  if (!grafanaUrl) {
    return res.status(500).json({ message: 'Grafana URL not configured' });
  }
  
  res.json({ url: grafanaUrl });
});

// Get admin statistics
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const totalPosts = await Post.count();
    const totalUsers = await User.count();
    const spammedPosts = await Post.count({
      where: Sequelize.literal('(SELECT COUNT(*) FROM "PostSpamReports" WHERE "PostSpamReports"."PostId" = "Post"."id") > 10')
    });
    
    res.json({
      totalPosts,
      totalUsers,
      spammedPosts,
      adminUsers: await User.count({ where: { isAdmin: true } })
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
