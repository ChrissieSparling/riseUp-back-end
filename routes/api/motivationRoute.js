const router = require('express').Router();
const { User, Motivation } = require('../../models');
const withAuth = require('../../utils/auth');
// riseUp.com/userId(can post)/Motivations (point you can get all Motivations)/MotivationId(find any Motivation by its id, update an Motivation, or delete an Motivation)

// general get request to GET all Motivation.
router.get('/', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
           const  postMotivation = await Motivation.findAll();
           if(postMotivation.length===0){
                res.status(404).json({message: 'No Motivation here!'})
            } else {

                res.status(200).json(postMotivation);
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
// get one Motivation by id.
router.get('/:id', withAuth, async (req, res) => {
    try {
        const postMotivation = await Motivation.findByPk(req.params.id, {
        include: [User],
        });
        if(!postMotivation){
            res.status(404).json({message: 'No Motivation found!'})
        } else {res.status(200).json(postMotivation);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

// post Motivation
router.post('/new', withAuth, async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPostMotivation = await Motivation.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPostMotivation);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// update Motivation
router.put('/:id', withAuth, async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPostMotivation = async () => {
            const edit = await Motivation.update(req.body, {
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
            editPostMotivation();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// delete Motivation
router.delete('/:id', withAuth, async (req, res)=>{
    try {
        const motivationDelete = Motivation.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (motivationDelete) {
        res.status(200).json({message: `Post has been deleted!`}).end();
        } else {
        res.status(404).json({message: `No post with that ID found!`});
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});

module.exports = router;

