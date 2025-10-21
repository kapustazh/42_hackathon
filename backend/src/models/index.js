const { Sequelize, DataTypes } = require('sequelize');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment');
}

const sequelize = new Sequelize(connectionString, {
  logging: false,
});

// users table
const User = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  forty_two_id: { type: DataTypes.INTEGER, unique: true, allowNull: false, index: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  last_post_timestamp: { type: DataTypes.DATE, allowNull: true },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
}, {
  timestamps: false,
  tableName: 'users'
});

// ideas table
const Idea = sequelize.define('ideas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
  locked_by_id: { type: DataTypes.INTEGER, allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
}, {
  timestamps: false,
  tableName: 'ideas'
});

// votes table
const Vote = sequelize.define('votes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  idea_id: { type: DataTypes.INTEGER, allowNull: false },
  vote_type: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false,
  tableName: 'votes',
  indexes: [{ unique: true, fields: ['user_id', 'idea_id'] }]
});

// Posts table (for whiteboard feature)
const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
}, {
  timestamps: false,
  tableName: 'Post'
});

// PostLikes table
const PostLikes = sequelize.define('PostLikes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  PostId: { type: DataTypes.INTEGER, allowNull: false },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false,
  tableName: 'PostLikes',
  indexes: [{ unique: true, fields: ['PostId', 'UserId'] }]
});

// PostDislikes table
const PostDislikes = sequelize.define('PostDislikes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  PostId: { type: DataTypes.INTEGER, allowNull: false },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false,
  tableName: 'PostDislikes',
  indexes: [{ unique: true, fields: ['PostId', 'UserId'] }]
});

// PostSpamReports table
const PostSpamReports = sequelize.define('PostSpamReports', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  PostId: { type: DataTypes.INTEGER, allowNull: false },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: false,
  tableName: 'PostSpamReports',
  indexes: [{ unique: true, fields: ['PostId', 'UserId'] }]
});

// Associations
User.hasMany(Idea, { foreignKey: 'user_id' });
Idea.belongsTo(User, { foreignKey: 'user_id' });

Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

module.exports = { sequelize, Sequelize, User, Idea, Vote, Post, PostLikes, PostDislikes, PostSpamReports };
