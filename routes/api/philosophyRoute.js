const router = require('express').Router();
const { User, Philosophy } = require('../../models');
// const  require('../../utils/auth');
// riseUp.com/userId(can post)/Philosophys (point you can get all Philosophys)/PhilosophyId(find any Philosophy by its id, update an Philosophy, or delete an Philosophy)

// general get request to GET all Philosophy.
router.get('/', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
           const  postPhilosophy = await Philosophy.findAll();
           if(postPhilosophy.length===0){
                res.status(404).json({message: 'No Philosophy here!'})
            } else {

                res.status(200).json(postPhilosophy);
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
// get one Philosophy by id.
router.get('/:id', async (req, res) => {
    try {
        const postPhilosophy = await Philosophy.findByPk(req.params.id, {
        include: [User],
        });
        if(!postPhilosophy){
            res.status(404).json({message: 'No Philosophy found!'})
        } else {res.status(200).json(postPhilosophy);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

// post Philosophy
router.post('/new', async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPostPhilosophy = await Philosophy.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPostPhilosophy);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// update Philosophy
router.put('/:id', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPostPhilosophy = async () => {
            const edit = await Philosophy.update(req.body, {
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
            editPostPhilosophy();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// delete Philosophy
router.delete('/:id', async (req, res)=>{
    try {
        const philosophyDelete = Philosophy.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (philosophyDelete) {
        res.status(200).json({message: `Post has been deleted!`}).end();
        } else {
        res.status(404).json({message: `No post with that ID found!`});
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});

module.exports = router;
// delete with auth for now may have to put back in later cs

