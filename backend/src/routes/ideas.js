const express = require('express');
const router = express.Router();
const { Idea, User, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

// GET /api/ideas - return all ideas (simple list)
router.get('/', async (req, res) => {
  const ideas = await Idea.findAll({ order: [['id', 'ASC']] });
  // Map to JSON format similar to tests
  const out = ideas.map(i => ({
    id: i.id,
    content: i.content,
    user_id: i.user_id,
    is_locked: i.is_locked,
    locked_by_id: i.locked_by_id,
    created_at: i.created_at,
  }));
  res.json(out);
});

// POST /api/ideas - create new idea; tests send { content, userId }
router.post('/', async (req, res) => {
  const { content, userId } = req.body;
  if (!content || content.trim() === '') return res.status(400).json({ error: 'Content required' });
  if (!userId) return res.status(400).json({ error: 'userId required' });

  // verify user exists
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const idea = await Idea.create({ user_id: userId, content });

  // Respond with created idea, but do not expose user_id as 'user_id' per tests they check not in returned body
  const resp = { id: idea.id, content: idea.content, is_locked: idea.is_locked, locked_by_id: idea.locked_by_id, created_at: idea.created_at };
  return res.status(201).json(resp);
});

// POST /api/ideas/:id/lock - lock the idea atomically; tests send { userId }
router.post('/:id/lock', async (req, res) => {
  const { userId } = req.body;
  const id = parseInt(req.params.id, 10);
  if (!userId) return res.status(400).json({ error: 'userId required' });

  // Ensure user exists
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Atomic update: only set locked if currently unlocked
  const rows = await sequelize.query(
    'UPDATE ideas SET is_locked = TRUE, locked_by_id = $1 WHERE id = $2 AND is_locked = FALSE RETURNING id, is_locked, locked_by_id',
    { bind: [userId, id], type: QueryTypes.SELECT }
  );

  if (!rows || rows.length === 0) {
    // Either idea doesn't exist or it was already locked
    const idea = await Idea.findByPk(id);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });
    return res.status(409).json({ error: 'Idea already locked' });
  }

  const out = rows[0];
  return res.json({ id: out.id, is_locked: out.is_locked, locked_by_id: out.locked_by_id });
});

module.exports = router;
