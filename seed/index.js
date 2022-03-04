const sequelize = require('../config/config');
const { User, Post, Comment } = require('../models');

const userData =  require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');
const affirmationData = require('./affirmationData.json');
const inspirationData = require('./inspirationData.json');
const motivationData = require('./motivationData.json');
const quoteData = require('./quoteData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    const posts = await Post.bulkCreate(postData, {
        individualHooks: true,
        returning: true,
    });

    const comments = await Comment.bulkCreate(commentData, {
        individualHooks: true,
        returning: true,
    });
    // added for positive apis

    const affirmations = await Affirmation.bulkCreate(affirmationData, {
        individualHooks: true,
        returning: true,
    });

    const inspirations = await Inspiration.bulkCreate(inspirationData, {
        individualHooks: true,
        returning: true,
    });

    const motivations = await Motivation.bulkCreate(motivationData, {
        individualHooks: true,
        returning: true,
    });

    const philosophy = await Philosophy.bulkCreate(philosophyData, {
        individualHooks: true,
        returning: true,
    });

    const quote = await Quote.bulkCreate(quoteData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedDatabase();