const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

Post.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Post.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  onDelete: 'SET NULL'
});
// need to add belongs to and has many for Motivation, Inspiration, Affirmation, Philosophy, Quote


module.exports = {
  User,
  Comment,
  Post,
  Inspiration,
  Motivation,
  Philosophy,
  Affirmation,
  Quote,
};