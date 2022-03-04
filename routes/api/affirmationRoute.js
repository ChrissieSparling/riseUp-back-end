const router = require('express').Router();
const { User, Affirmation } = require('../../models');
const withAuth = require('../../utils/auth');
// riseUp.com/userId(can post)/Affirmations (point you can get all Affirmations)/AffirmationId(find any Affirmation by its id, update an Affirmation, or delete an Affirmation)

// general get request to GET all Affirmation.
router.get('/', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
           const  postAffirmation = await Affirmation.findAll();
           if(postAffirmation.length===0){
                res.status(404).json({message: 'No Affirmation here!'})
            } else {

                res.status(200).json(postAffirmation);
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
// get one Affirmation by id.
router.get('/:id', withAuth, async (req, res) => {
    try {
        const postAffirmation = await Affirmation.findByPk(req.params.id, {
        include: [User],
        });
        if(!postAffirmation){
            res.status(404).json({message: 'No Affirmation found!'})
        } else {res.status(200).json(postAffirmation);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

// post Affirmation
router.post('/new', withAuth, async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPostAffirmation = await Affirmation.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPostAffirmation);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// update Affirmation
router.put('/:id', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPostAffirmation = async () => {
            const edit = await Affirmation.update(req.body, {
                where: {
                id: req.params.id,
                },
            });
            if (edit) {
                res.status(200).json(edit).end();
            } else {
                res.status(404).json({message: `That post not found!`}).end();
            }
        }
        // if(req.session.userID===parseInt(req.params.id)){
            editPostAffirmation();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// delete Affirmation
router.delete('/:id', withAuth, async (req, res)=>{
    try {
        const affirmationDelete = Affirmation.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (affirmationDelete) {
        res.status(200).json({message: `Post has been deleted!`}).end();
        } else {
        res.status(404).json({message: `No post with that ID found!`});
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});

module.exports = router;

