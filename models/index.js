const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Relationship = require('./Relationship')
const Affirmation = require('./Affirmation');
const Motivation = require('./Motivation');
const Inspiration = require('./Inspiration');
const Philosophy = require('./Philosophy');
const Quote = require('./Quote');
const LikePost = require('./LikePost');
const LikeComment = require('./LikeComment');
const FlaggedUser = require('./FlaggedUser');
const FlaggedPost = require('./FlaggedPost');
const FlaggedComment = require('./FlaggedComment');

Post.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Post, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

LikePost.belongsTo(User, {
  as: 'like_post',
  foreignKey: 'user_id'
})

LikePost.belongsTo(Post, {
  as: 'post_liked',
  foreignKey: 'post_id'
})

Post.hasMany(LikePost, {
  as:'post_is_liked',
  foreignKey: 'post_id'
})

User.hasMany(LikePost, {
  as:'user_likes_post',
  foreignKey: 'user_id'
})

User.belongsToMany(Post, {
  as: 'post_liker',
  through: LikePost,
  foreignKey: 'user_id',
  onDelete: 'cascade',
})

Post.belongsToMany(User, {
  as: 'liked_post',
  through: LikePost,
  foreignKey: 'post_id',
  onDelete: 'cascade',
})

LikeComment.belongsTo(User, {
  as: 'like_comment',
  foreignKey: 'user_id'
})

LikeComment.belongsTo(Comment, {
  as: 'comment_liked',
  foreignKey: 'comment_id'
})

User.belongsToMany(Comment, {
  as: 'comment_liker',
  through: LikeComment,
  foreignKey: 'user_id',
  onDelete: 'cascade',
})

Comment.belongsToMany(User, {
  as: 'liked_comment',
  through: LikeComment,
  foreignKey: 'comment_id',
  onDelete: 'cascade',
})

Comment.hasMany(LikeComment, {
  as: 'comment_is_liked',
  foreignKey: 'comment_id'
})

User.hasMany(LikeComment, {
  as: 'user_likes_comment',
  foreignKey: 'comment_id'
})

FlaggedComment.belongsTo(Comment, {
  as: 'flagged_comment',
  foreignKey: 'comment_id'
})

FlaggedComment.belongsTo(User, {
  as: 'flagger_comment',
  foreignKey: 'flagger_id'
})

User.hasMany(FlaggedComment, {
  as: 'user_flagged_comment',
  foreignKey: 'flagger_id'
})

Comment.hasMany(FlaggedComment, {
  as: 'comment_is_flagged',
  foreignKey: 'comment_id'
})

User.belongsToMany(Comment, {
  as: 'comment_flagger',
  through: FlaggedComment,
  foreignKey: 'flagger_id',
  onDelete: 'cascade'
})

Comment.belongsToMany(User, {
  as: 'comment_flagged',
  through: FlaggedComment,
  foreignKey: 'comment_id',
  onDelete: 'cascade'
})

FlaggedPost.belongsTo(Post, {
  as: 'flagged_post',
  foreignKey: 'post_id'
})

FlaggedPost.belongsTo(User, {
  as: 'flagger_post',
  foreignKey: 'post_flagger_id'
})

User.hasMany(FlaggedPost, {
  as: 'user_flagged_post',
  foreignKey: 'post_flagger_id'
})

Post.hasMany(FlaggedPost, {
  as: 'post_is_flagged',
  foreignKey: 'post_id'
})

User.belongsToMany(Post, {
  as: 'post_flagger',
  through: FlaggedPost,
  foreignKey: 'post_flagger_id',
  onDelete: 'cascade'
})

Post.belongsToMany(User, {
  as: 'post_flagged',
  through: FlaggedPost,
  foreignKey: 'post_id',
  onDelete: 'cascade'
})

FlaggedUser.belongsTo(User, {
  as: 'flagged_user',
  foreignKey: 'user_id'
})

FlaggedUser.belongsTo(User, {
  as: 'flagger_user',
  foreignKey: 'mod_id'
})

User.hasMany(FlaggedUser, {
  as: 'mod_flagged_user',
  foreignKey: 'mod_id',
  onDelete: 'cascade'
})

User.hasMany(FlaggedUser, {
  as: 'flagged_by_mod',
  foreignKey: 'user_id',
  onDelete: 'cascade'
})

User.belongsToMany(User, {
  as: 'user_flagger',
  through: FlaggedUser,
  foreignKey: 'mod_id',
  onDelete: 'cascade'
})

User.belongsToMany(User, {
  as: 'user_flagged',
  through: FlaggedUser,
  foreignKey: 'user_id',
  onDelete: 'cascade'
})

Relationship.belongsTo(User, {
  as: 'follower',
  foreignKey: 'follower_id'
});

Relationship.belongsTo(User, {
  as: 'followed',
  foreignKey: 'followed_id'
});

User.belongsToMany(User, {
  as: 'following',
  through: Relationship,
  foreignKey: 'follower_id',
  onDelete: 'cascade',
});

User.belongsToMany(User, {
  as: 'followers',
  through: Relationship,
  foreignKey: 'followed_id',
  onDelete: 'cascade',
});

User.hasMany(Relationship, {
  as: 'active_relationships', 
  foreignKey: 'follower_id',
  onDelete: 'cascade'
})

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

Affirmation.belongsToMany(User, {through: 'UserAffirmation'});
User.belongsToMany(Affirmation, {through: 'UserAffirmation'});

Motivation.belongsToMany(User, {through: 'UserMotivation'});
User.belongsToMany(Motivation, {through: 'UserMotivation'});

Inspiration.belongsToMany(User, {through: 'UserInspiration'});
User.belongsToMany(Inspiration, {through: 'UserInspiration'});

Philosophy.belongsToMany(User, {through: 'UserPhilosophy'});
User.belongsToMany(Philosophy, {through: 'UserPhilosophy'});

// Affirmation.belongsTo(User, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// User.hasMany(Affirmation, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// Motivation.belongsTo(User, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// User.hasMany(Motivation, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// Inspiration.belongsTo(User, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// User.hasMany(Inspiration, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// Philosophy.belongsTo(User, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

// User.hasMany(Philosophy, {
//   foreignKey: 'userId',
//   onDelete: 'CASCADE'
// });

Quote.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

User.hasMany(Quote, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

module.exports = {
  User,
  Comment,
  Post,
  Inspiration,
  Motivation,
  Philosophy,
  Affirmation,
  Quote,
  Relationship,
  LikePost,
  LikeComment,
  FlaggedComment,
  FlaggedPost,
  FlaggedUser
};