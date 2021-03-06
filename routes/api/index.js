const router = require('express').Router();
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const userRoutes = require('./userRoutes');
const affirmationRoute = require('./affirmationRoute');
const inspirationRoute = require('./inspirationRoute');
const motivationRoute = require('./motivationRoute');
const philosophyRoute = require('./philosophyRoute');
const quoteRoute = require('./quoteRoute');

router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/affirmations', affirmationRoute);
router.use('/inspirations', inspirationRoute);
router.use('/motivations', motivationRoute);
router.use('/philosophy', philosophyRoute);
router.use('/quotes', quoteRoute);



module.exports = router;