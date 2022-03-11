

const router = require('express').Router();
const { hasAccess, verifyToken } = require('../../middlewares/authJWT');
const {User, Post, Comment} = require('../../models/');

///////Routes to get all comments for a specific post and to create a new comment are in the postRoutes.js file

//get all comments: this probably only needs to be available to mod and admin: no one else just needs a list of all the comments
router.get('/', verifyToken, async (req, res) => {
    try {
        if(req.role==='admin' || 'mod'){
            const commentData = await Comment.findAll({
                include: [User, Post],
            });
            if(commentData.length===0){
                res.status(404).json({message: 'No Comments found!'})
            }else {
                res.status(200).json(commentData);
            }
        } else {
            req.status(401).json({message: 'That action is not allowed.'})
        }
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

//get comment by ID: any paid user can get/read their own comment (by the foreign key > userId). WOuld this be used to render comment into edit form?
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            // where: {userId: req.userId},
            include: [User, Post],
        });
        if(!commentData){
            res.status(404).json({message: 'No comment found!'})
        } else if ((commentData.userId!==req.userId)||(!hasAccess(req.role, 'readAny', 'comment', ['*']))){
            req.status(401).json({message: 'That action is not allowed.'})
        } else {
            res.status(200).json(commentData);
        }
    } catch (err) {
        res.status(500).json({message:`There was an error: ${err}`});
    }
});

//edit comment: any paid user can edit their OWN comment (by foreign key > userId). NO ONE can edit ANY comment. Can trigger this with a button on the comment itself (located on the individual post card)
router.put('/:id', verifyToken, async (req, res) => {
    try {
      const comment = await Comment.update(req.body, {
        where: {
            userId: req.userId,
            id: req.params.id
        },
      });
  
      if (comment[0]) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({message: `Unable to update comment!`});
      }
    } catch (err) {
      res.status(500).json({message: `There was an error: ${err}`});
    }
  });

//delete comment: any paid user can delete their OWN comment. Ony mod and admin can delete ANY comment. Can trigger this with button next to comment on individual post card. Can add additional place to request in mod or admin profiles.
router.delete('/:id', verifyToken, async (req, res)=>{
    try {
        const comment = Comment.destroy({
        where: {
            // userId: req.userId,
            id: req.params.id
        },
        });
        if(!comment){
            res.status(401).json({message: `Unable to delete comment!`});
        } else if ((comment.userID===req.userID)||(hasAccess(req.role, 'deleteAny', 'comment'))) {
        res.status(200).json({message: `Comment has been deleted!`});
        } else {
            res.status(401).json({message: `That action is not allowed!`});
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});


module.exports = router;