const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Affirmation = require('./Affirmation');
const Motivation = require('./Motivation');
const Inspiration = require('./Inspiration');
const Philosophy = require('./Philosophy');
// const Quote = require('./Quote');

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
// cs added Motivation, Inspiration, Affirmation, Philosophy, Quote

Affirmation.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Affirmation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Motivation.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Motivation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Inspiration.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Inspiration, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Philosophy.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Philosophy, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

// Quote.belongsTo(User, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// User.hasMany(Quote, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

module.exports = {
  User,
  Comment,
  Post,
  Inspiration,
  Motivation,
  Philosophy,
  Affirmation,
  // Quote,
};