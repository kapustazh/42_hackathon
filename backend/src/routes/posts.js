const express = require('express');
const router = express.Router();
const { Post, User, PostLikes, PostDislikes, PostSpamReports, sequelize, Sequelize } = require('../models');
const { newPostsTotal, votesTotal } = require('../services/metrics');

function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
}

// Create a post with 24-hour rate limit per user
router.post('/', ensureAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const now = new Date();
  if (user.last_post_timestamp) {
    const diff = now - new Date(user.last_post_timestamp);
    const hours = diff / (1000 * 60 * 60);
    if (hours < 24) {
      const remainingHours = Math.ceil(24 - hours);
      return res.status(403).json({
        error: `You can only post once per 24 hours. Please wait ${remainingHours} more hour(s).`
      });
    }
  }

  if (!req.body.content || req.body.content.trim() === '') {
    return res.status(400).json({ error: 'Content is required' });
  }

  const post = await Post.create({ content: req.body.content, authorId: user.id });
  user.last_post_timestamp = now;
  await user.save();

  // Increment metrics counter
  newPostsTotal.inc();

  res.status(201).json({ id: post.id, content: post.content, createdAt: post.createdAt });
});

// Get all posts with counts, filter spamCount <= 10
router.get('/', async (req, res) => {
  // Fetch all posts with counts using subqueries
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
    order: [['createdAt', 'DESC']],
    raw: false
  });

  // Filter posts with spamCount <= 10 in JavaScript
  const result = posts
    .filter(p => {
      const spamCount = parseInt(p.dataValues.spamCount, 10) || 0;
      return spamCount <= 10;
    })
    .map(p => ({
      id: p.id,
      content: p.content,
      author: p.author ? p.author.username : null,
      likeCount: parseInt(p.dataValues.likeCount, 10) || 0,
      dislikeCount: parseInt(p.dataValues.dislikeCount, 10) || 0,
      spamCount: parseInt(p.dataValues.spamCount, 10) || 0,
      createdAt: p.createdAt
    }));

  res.json(result);
});

// Vote endpoint: like, dislike, spam
router.post('/:id/vote', ensureAuth, async (req, res) => {
  const { voteType } = req.body;
  const postId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  if (!['like', 'dislike', 'spam'].includes(voteType)) {
    return res.status(400).json({ error: 'Invalid voteType. Must be: like, dislike, or spam' });
  }

  const post = await Post.findByPk(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  try {
    if (voteType === 'like') {
      // Remove dislike if exists, add like (ignore if already exists)
      await PostDislikes.destroy({ where: { PostId: postId, UserId: userId } });
      await PostLikes.findOrCreate({ where: { PostId: postId, UserId: userId } });
    } else if (voteType === 'dislike') {
      // Remove like if exists, add dislike
      await PostLikes.destroy({ where: { PostId: postId, UserId: userId } });
      await PostDislikes.findOrCreate({ where: { PostId: postId, UserId: userId } });
    } else if (voteType === 'spam') {
      // Add spam report (ignore if duplicate)
      await PostSpamReports.findOrCreate({ where: { PostId: postId, UserId: userId } });
    }

    // Increment metrics counter
    votesTotal.inc({ vote_type: voteType });

    return res.json({ ok: true, message: `Vote '${voteType}' recorded successfully` });
  } catch (err) {
    console.error('Vote error:', err);
    return res.status(500).json({ error: 'Failed to record vote' });
  }
});

module.exports = router;
