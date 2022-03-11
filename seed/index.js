const sequelize = require('../config/config');
const { User, Post, Comment, Philosophy, Inspiration, Affirmation, Motivation, Quote } = require('../models');

const userData =  require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');
const affirmationData = require('./affirmationData.json');
const inspirationData = require('./inspirationData.json');
const motivationData = require('./motivationData.json');
const philosophyData = require('./philosophyData.json');
const quoteData = require('./quoteData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    // added for positive apis
     await Affirmation.bulkCreate(affirmationData, {
        individualHooks: true,
        returning: true,
    });

    await Inspiration.bulkCreate(inspirationData, {
        individualHooks: true,
        returning: true,
    });

    await Motivation.bulkCreate(motivationData, {
        individualHooks: true,
        returning: true,
    });

   await Philosophy.bulkCreate(philosophyData, {
        individualHooks: true,
        returning: true,
    });

    await Quote.bulkCreate(quoteData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedDatabase();