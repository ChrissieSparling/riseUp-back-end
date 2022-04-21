
const router = require('express').Router();
const { hasAccess, verifyToken } = require('../../middlewares/authJWT');
const { User, Post, Comment, LikePost, LikeComment, FlaggedPost, FlaggedComment } = require('../../models/');


//get all posts: these will be rendered on the forum page (filtered by topic?) All users can read all posts
router.get('/', verifyToken, async (req, res) => {
    try {
            const postData = await Post.findAll({
                include: [Comment, {
                    model: User, 
                    attributes: ['id', 'username'],
                    order: ['username', 'DESC']
                }],
            });
            if(postData.length===0){
                console.log('no posts found!!')
                res.status(404).json({message: 'No posts found!'})
            } else {
                console.log('=========postData', postData)
                res.status(200).json(postData);
            }        
    } catch (err) {
        res.status(500).json({message:`There was an error: ${err}`});
    }
  });

//get post by id: these will render on the individual post cards if the user clicks on a forum card. The user will write comments on the individual post card. All users can read a post by id
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{
                model: Comment,
                include: [{
                    model: LikeComment,
                    as: 'comment_is_liked',
                    include: [{
                        model: User,
                        attributes: ['username'],
                        as:'like_comment'
                    }]
                }]
            },{
                model: User,
                attributes: ['username']
            },{
                model: LikePost,
                as: 'post_is_liked',
                include: [{
                    model: User,
                    attributes: ['username'],
                    as:'like_post'
                }]
            }],
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found!' })
        } else { res.status(200).json(postData); }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//get posts by topic
router.get('/forum/:topic', verifyToken, async (req, res) => {
    try {
        console.log(req.params.topic)
        const postData = await Post.findAll({
            where: { topic: req.params.topic },
            include: [Comment, {
                model: User,
                attributes: ['username']
            }],
        });
        if (postData.length === 0) {
            console.log('no posts found!!')
            res.status(404).json({ message: 'No posts found!' })
        } else {
            console.log('=========postData', postData)
            res.status(200).json(postData);
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//get posts by user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        console.log(req.params.userId)
        const postData = await Post.findAll({
            where: { userId: req.params.userId },
            attributes: ['id', 'title']
        });
        if (postData.length === 0) {
            console.log('no posts found!!')
            res.status(404).json({ message: 'No posts found!' })
        } else {
            console.log('=========postData', postData)
            res.status(200).json(postData);
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//get all comments for a particular post: this probably only needs to be available to mod and admin: no one else just needs a list of all the comments
router.get('/:postId/comments', verifyToken, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: { postId: req.params.postId },
            include: [{
                model: User,
                attributes: ['username']
            }, {
                model: LikeComment,
                as: 'comment-is-liked',
                include: [{
                    model: User,
                    attributes: ['username'],
                    as:'like_comment'
                }]
            }],
        });
        if (commentData.length === 0) {
            res.status(404).json({ message: 'No Comments found!' })
        } else {
            res.status(200).json(commentData);
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//like post
router.put('/like/:postId', verifyToken, async (req, res) => {
    console.log('-------------in the route-----------------')
    try {
        console.log('+++++++++++++this is the put request+++++++++++++++++++++', req.params.postId)
        const alreadyLiked = await LikePost.findOne({
            where: {
                user_id: req.userId,
                post_id: req.params.postId
            }
        })
        console.log(alreadyLiked)
        if (alreadyLiked===null) {
            const post = await Post.update(req.body, {
                where: {
                    id: req.params.postId,
                },
            });
            if (post) {
                console.log('------heres the post', post)
                LikePost.create({
                    user_id: req.userId,
                    post_id: req.params.postId
                })
                res.status(200).json({ message: 'post liked' }).end();
            } else {
                res.status(404).json({ message: `That post not found!` }).end();
            }
        } else {
            res.status(400).json({ message: 'You already liked this post.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//flag post
router.put('/flag/:postId', verifyToken, async (req, res) => {
    console.log('-------------in the flag post route-----------------')
    try {
        console.log('+++++++++++++this is the put request+++++++++++++++++++++', req.params.postId)
        const alreadyFlagged = await FlaggedPost.findOne({
            where: {
                post_id: req.params.postId
            }
        })
        console.log(alreadyFlagged)
        if (alreadyFlagged===null) {
            const post = await Post.update(req.body, {
                where: {
                    id: req.params.postId,
                },
            });
            if (post) {
                console.log('------heres the post', post)
                FlaggedPost.create({
                    post_flagger_id: req.userId,
                    post_id: req.params.postId
                })
                res.status(200).json({ message: 'post flagged' }).end();
            } else {
                res.status(404).json({ message: `That post not found!` }).end();
            }
        } else {
            res.status(400).json({ message: 'This post has already been flagged.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//unflag post
router.put('/unflag/:id', verifyToken, async (req, res) => {
    try {
        console.log('this is the put request', req.params.id)
        const alreadyFlagged = await FlaggedPost.findOne({
            where: {
                post_flagger_id: req.userId,
                post_id: req.params.id
            }
        })
        if ((alreadyFlagged!==null)||(req.role==='mod')||(req.role==='admin')) {
            const post = await Post.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            if (post) {
                FlaggedPost.destroy({
                    where: {
                        post_flagger_id: post.userId,
                        post_id: post.id
                    }
                })
                res.status(200).json({ message: 'post unflagged' }).end();
            } else {
                res.status(404).json({ message: `That post not found!` }).end();
            }
        } else {
            res.status(403).json({ message: 'You cannot perform this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//create post: this will be attached to an event listener on the "create post" form. Paid users and above can post posts? Unpaid can only view?
router.post('/new', verifyToken, async (req, res) => {
    //need:
    //topic
    //title
    //body
    try {
        console.log('You requested to create a new post')
        if (hasAccess(req.role, 'createOwn', 'post')) {
            const body = req.body;
            const newPost = await Post.create({ ...body, userId: req.userId });
            res.status(200).json(newPost);
        } else {
            res.status(401).json({ message: 'This feature is for subscribers only' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//post comment: any paid user and greater can post/create a new comment on any post. Used on the individual post cards.
router.post('/:postId/comments/new', verifyToken, async (req, res) => {
    //need:
    //body:
    //postId: >> in production, this will be grabbed from the post object on the same card
    try {
        if (hasAccess(req.role, 'createOwn', 'comment')) {
            const body = req.body;
            const newComment = await Comment.create({ ...body, userId: req.userId, postId: req.params.postId });
            res.status(200).json(newComment);
        } else {
            res.status(401).json({ message: 'This feature is for subscribers only' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//edit post: this will be requested onclick from the edit post form. Any paid user can edit their OWN post. NO ONE can edit other users' posts.
router.put('/:id', verifyToken, async (req, res) => {
    try {
        console.log('this is the put request', req.params.id)
        const matchPost = await Post.findByPk(req.params.id)
        const editPost = async () => {
            const post = await Post.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            if (post) {
                res.status(200).json(post).end();
            } else {
                res.status(404).json({ message: `That post not found!` }).end();
            }
        }
        if (matchPost.userId === req.userId) {
            editPost();
        } else {
            req.status(401).json({ message: 'That action is not allowed.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});



//delete post: any paid user can delete their own post, only mod and admin can delete ANY post. Can be requested from multiple places: forum cards on their own posts, edit post form?
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const matchPost = await Post.findByPk(req.params.id)
        if ((matchPost.userId === req.userId) || (hasAccess(req.role, 'deleteAny', 'post'))) {
            const post = Post.destroy({
                where: {
                    id: req.params.id,
                },
            });
            if (post) {
                res.status(200).json({ message: `Post has been deleted!` }).end();
            } else {
                res.status(404).json({ message: `No post with that ID found!` });
            }
        } else {
            req.status(401).json({ message: 'That action is not allowed.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error!: ${err}` });
    }
});

module.exports = router;