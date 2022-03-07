
//I have commented out all of the AccessControl stuff for the moment: I'm still 
//working on modularizing it so we don't have to have it in every routes folder.
const router = require('express').Router();
const jwt = require("jsonwebtoken");
const { hasAccess, verifyToken } = require('../../middlewares/authJWT');
const {User, Post, Comment} = require('../../models/');

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

//get all users (admin role only)
router.get('/', verifyToken, async (req, res) => {
    try {
        if(hasAccess(req.role, 'readAny', 'user')){
            const userData = await User.findAll({
                // include: [Post, Comment]
            });
            if(!userData){
                res.status(404).json({message: 'No users found!'})
            } else {
                res.status(200).json(userData);
            }
         } else {
             res.status(403).json({message: 'User not authorized for this action.'})
         }
    } catch (err) {
        res.status(500).json({message:`There was an error: ${err}`});
    }
});

//get user by id (anyone can get their own user, only admin can ger ANY user)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        console.log(req.userId)
        if((req.userId===req.params.id)||(hasAccess(req.role, 'readAny', 'user'))){
        const getUser = async () => {
            const userData = await User.findByPk(req.params.id, {
                // include: [Post, Comment],
                });
                if(!userData){
                    res.status(404).json({message: 'No users found!'})
                } else {
                    res.status(200).json(userData);
                }
        }
            getUser();
        } else {
            res.status(403).json({message: 'User not authorized for this action.'})
        }
    } catch (err) {
    res.status(500).json({message:`There was an error: ${err}`});
    }
    });

//create new user: anyone can create a new user object for themselves, only admin should have the ability to create a user and assign them a specific role (like mod)
router.post('/new', async (req, res) => {
    //need:
    //firstName:
    //lastName:
    //username:
    //password:
    //role: >> in final app, we will assign this to the based on their status
    //email:
    //birthday:
    //zipCode:
    try {
        const newUser = await User.create({...req.body});
        if(newUser){
        const token = jwt.sign({id: newUser.id, role:newUser.role}, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_MAX_AGE
        });
            res.status(200).json({
                id: newUser.id,
                username: newUser.username,
                // role: newUser.role,
                // auth: true,
                accessToken: token
            })
        } else {res.status(400).json({message: 'Not all required data was recieved!'})}
    } catch (err) {
        res.status(500).json(err);
    }
});

  //edit user: anyone can edit their OWN user obj (except their ID), but only an admin can edit ANY user object (like change their role: this can be limited access)
  router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateUser = async () => {
            const user = await User.update(req.body, {
                where: {
                id: req.params.id,
                },
            });
        
            if (user) {
                res.status(200).json({message: `User updated successfully!`});
            } else {
                res.status(404).json({message: `That user not found!`});
            }
        } 
        if((req.userId===req.params.id)||(hasAccess(req.role, 'updateAny', 'user'))){
            updateUser();
        } else {
            res.status(403).json({message: 'User not authorized for this action.'})
        }
    } catch (err) {
      res.status(500).json({message: `There was an error: ${err}`});
    }
  });

//delete user account: any user can delete their own user, only admin can delete ANY account (we can assign what actually happens when we send a "delete" request: this should probably just deactivate the person's account and archive it)
router.delete('/:id', verifyToken, async (req, res)=>{
    try {
        const deleteUser = () => {
            const user = User.destroy({
            where: {
                id: req.params.id,
            },
            });
        
            if (user) {
            res.status(200).json({message: `User has been deleted!`}).end();
            } else {
            res.status(404).json({message: `No user with that ID found!`});
            }
        }
        if((req.userId===req.params.id)||(hasAccess(req.role, 'deleteAny', 'user'))){
            deleteUser();
        } else {
            res.status(403).json({message: 'User not authorized for this action.'})
        }
    } catch (err) {
        res.status(500).json({message: `There was an error!: ${err}`});
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
            });
            console.log('============user===========', user)
        const validPassword = user.checkPassword(req.body.password);
        if (!user) {
            res.status(400).json({ message: 'check your username or password!' });
            return;
        } else if (!validPassword) {
            res.status(400).send({ 
                accessToken: null,
                message: 'check your username or password!' 
            });
        } else {
            const token = jwt.sign({id: user.id, role:user.role}, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_MAX_AGE
            });

            res.status(200).json({
                id: user.id,
                // username: user.username,
                // email: user.email,
                // role: user.role,
                // auth: true,
                accessToken: token
            })
        }
    } catch (err) {
        res.status(500).json({ message: `there was a problem: ${err}` });
    }
})

//logout       NEED TO CONVERT FOR JWT
// router.post('/logout', (req, res) => {
//     try{
//         if (req.session.loggedIn) {
//         req.session.destroy(() => {
//             res.status(204).json({message: `User successfully logged out!`});
//         });
//         } else {
//         res.status(404).json({message:'User already logged out'}).end();
//         }
//     } catch (err) {
//         res.status(500).json({message: `there was an error: ${err}`})
//     }
// });

module.exports = router;