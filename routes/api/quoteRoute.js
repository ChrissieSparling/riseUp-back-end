const router = require('express').Router();
const { User, Quote } = require('../../models');
// const  require('../../utils/auth');
// riseUp.com/userId(can post)/Quotes (point you can get all Quotes)/QuoteId(find any Quote by its id, update an Quote, or delete an Quote)

// general get request to GET all Quote.
router.get('/', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).readAny('post');
        // const getPosts = async () => {
           const  postQuote = await Quote.findAll();
           if(postQuote.length===0){
                res.status(404).json({message: 'No Quote here!'})
            } else {

                res.status(200).json(postQuote);
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
// get one Quote by id.
router.get('/:id', async (req, res) => {
    try {
        const postQuote = await Quote.findByPk(req.params.id, {
        include: [User],
        });
        if(!postQuote){
            res.status(404).json({message: 'No Quote found!'})
        } else {res.status(200).json(postQuote);}
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
});

// post Quote
router.post('/new', async (req, res) => {
    //need:
    //topic
    //title
    //body
    const body = req.body;
    try {
        const newPostQuote = await Quote.create({ ...body, userId: req.session.userId });
        res.status(200).json(newPostQuote);
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// update Quote
router.put('/:id', async (req, res) => {
    try {
        // const role = req.session.role;
        // const permission = ac.can(role).updateAny('post');
        const editPostQuote = async () => {
            const edit = await Quote.update(req.body, {
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
            editPostQuote();
        // } else if(permission.granted){
        //     editPost()
        // } else {
        //     res.status(403).json({message: `User not authorized for this actions.`})
        // }
    } catch (err) {
        res.status(500).json({message: `There was an error: ${err}`});
    }
});

// delete Quote
router.delete('/:id', async (req, res)=>{
    try {
        const quoteDelete = Quote.destroy({
        where: {
            id: req.params.id,
        },
        });
    
        if (quoteDelete) {
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

