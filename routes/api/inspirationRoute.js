
const router = require('express').Router();
const { User, Inspiration } = require('../../models');
// const  = require('../../utils/auth');
// riseUp.com/userId(can post)/inspirations (point you can get all inspirations)/inspirationId(find any inspiration by its id, update an inspiration, or delete an inspiration)

// general get request to GET all inspiration.
router.get('/', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
           const  postInspiration = await Inspiration.findAll();
           if(postInspiration.length===0){
                res.status(404).json({message: 'No inspiration here!'})
            } else {

                res.status(200).json(postInspiration);
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
// get one inspiration by id.
router.get('/:id', async (req, res) => {
    try {
        const postInspiration = await Inspiration.findByPk(req.params.id, {
        include: [User],
        });
        if(!postInspiration){
            res.status(404).json({message: 'No Inspiration found!'})
        } else {res.status(200).json(postInspiration);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

// post inspiration decide if we want /new or / because this is not working with /new
router.post('/new', async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPostInspiration = await Inspiration.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPostInspiration);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// update inspiration
router.put('/:id', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPostInspiration = async () => {
            const edit = await Inspiration.update(req.body, {
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
            editPostInspiration();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// delete inspiration
router.delete('/:id', async (req, res)=>{
    try {
        const inspirationDelete = Inspiration.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (inspirationDelete) {
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

