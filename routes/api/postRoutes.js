
//I have commented out all of the AccessControl stuff for the moment: I'm still working on modularizing it so we don't have to have it in every routes folder.//

const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth')

const ac = require('../../roles')

//get all posts: these will be rendered on the forum page (filtered by topic?) All users can read all posts
router.get('/', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
            const postData = await Post.findAll({
                include: Comment,
            });
            if(postData.length===0){
                res.status(404).json({message: 'No posts found!'})
            } else {

                res.status(200).json(postData);
            // }
        }
        // if(permission.granted){
        //     getPosts();
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
        
    } catch (err) {
        res.status(500).json({message:`There was an error: ${err}`});
    }
  });

//get post by id: these will render on the individual post cards if the user clicks on a forum card. The user will write comments on the individual post card. All users can read a post by id
router.get('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
        include: [User, Comment],
        });
        if(!postData){
            res.status(404).json({message: 'No post found!'})
        } else {res.status(200).json(postData);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

//get all comments for a particular post: this probably only needs to be available to mod and admin: no one else just needs a list of all the comments
router.get('/:postId/comments', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            where: {postId: req.params.postId},
            include: [User],
        });
        if(commentData.length===0){
            res.status(404).json({message: 'No Comments found!'})
        }else {

        res.status(200).json(commentData);
        }
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

//create post: this will be attached to an event listener on the "create post" form. Paid users and above can post posts? Unpaid can only view?
router.post('/new', withAuth, async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPost = await Post.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

//post comment: any paid user and greater can post/create a new comment on any post. Used on the individual post cards.
router.post('/:postId/comments/new', withAuth, async (req, res)=>{
    //need:
    //body:
    //postId: >> in production, this will be grabbed from the post object on the same card
    const body = req.body;
    try {
        const newComment = await Comment.create({ ...body, userId: req.session.userId, postId: req.params.postId });
        res.status(200).json(newComment);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

//edit post: this will be requested onclick from the edit post form. Any paid user can edit their OWN post. NO ONE can edit other users' posts.
router.put('/:id', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPost = async () => {
            const post = await Post.update(req.body, {
                where: {
                id: req.params.id,
                },
            });
            if (post) {
                res.status(200).json(post).end();
            } else {
                res.status(404).json({message: `That post not found!`}).end();
            }
        }
        // if(req.session.userID===parseInt(req.params.id)){
            editPost();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

//delete post: any paid user can delete their own post, only mod and admin can delete ANY post. Can be requested from multiple places: forum cards on their own posts, edit post form?
router.delete('/:id', withAuth, async (req, res)=>{
    try {
        const post = Post.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (post) {
        res.status(200).json({message: `Post has been deleted!`}).end();
        } else {
        res.status(404).json({message: `No post with that ID found!`});
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});

module.exports = router;