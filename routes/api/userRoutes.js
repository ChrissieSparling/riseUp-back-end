
//I have commented out all of the AccessControl stuff for the moment: I'm still 
//working on modularizing it so we don't have to have it in every routes folder.

const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth')

// const ac = require('../../roles')

//get all users (admin role only)
router.get('/', withAuth, async (req, res) => {
    try {
        // const role = req.session.role
        // const permission = ac.can(role).readAny('user');
        // if(permission.granted){
            const userData = await User.findAll({
                include: [Post, Comment]
            });
            if(!userData){
                res.status(404).json({message: 'No users found!'})
            } else {
                res.status(200).json(userData);
            }
        //  } else {
        //      res.status(403).json({message: 'User not authorized for this action.'})
        //  }
    } catch (err) {
        res.status(500).json({message:`There was an error: ${err}`});
    }
});

//get user by id (anyone can get their own user, only admin can ger ANY user)
router.get('/:id', withAuth, async (req, res) => {
    try {
        // const role = req.session.role
        // const permission = ac.can(role).readAny('user');
        const getUser = async () => {
            const userData = await User.findByPk(req.params.id, {
                include: [Post, Comment],
                });
                if(!userData){
                    res.status(404).json({message: 'No users found!'})
                } else {
                    res.status(200).json(userData);
                }
        }
        // console.log('session id:', req.session.userId);
        // console.log(typeof req.session.userId)
        // console.log(typeof req.params.id)
        // console.log(req.session.userId===parseInt(req.params.id))
        // if(req.session.userId===parseInt(req.params.id)){
            getUser();
        // } else if (permission.granted){
            // getUser();
        // } else {
        //     res.status(403).json({message: 'User not authorized for this action.'})
        // }
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

        req.session.save(() => {
        req.session.userId = newUser.id;
        req.session.username = newUser.username;
        req.session.role = newUser.role;
        req.session.loggedIn = true;

        res.status(200).json(newUser);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

  //edit user: anyone can edit their OWN user obj (except their ID), but only an admin can edit ANY user object (like change their role: this can be limited access)
  router.put('/:id', withAuth, async (req, res) => {
    try {
        // const role = req.session.role
        // const permission = ac.can(role).updateAny('user');
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
        if(req.session.userId===req.params.id){
            updateUser();
        // } else if (permission.granted){
        //     updateUser();
        } else {
            res.status(403).json({message: 'User not authorized for this action.'})
        }
    } catch (err) {
      res.status(500).json({message: `There was an error: ${err}`});
    }
  });

//delete user account: any user can delete their own user, only admin can delete ANY account (we can assign what actually happens when we send a "delete" request: this should probably just deactivate the person's account and archive it)
router.delete('/:id', withAuth, async (req, res)=>{
    try {
        // const role = req.session.role
        // const permission = ac.can(role).deleteAny('user');
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
        if(req.session.userId===req.params.id){
            deleteUser();
        // } else if (permission.granted){
        //     deleteUser();
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
        const user = await User.findOne({
        where: {
            username: req.body.username,
        },
        });

        if (!user) {
        res.status(400).json({ message: 'check your username or password!' });
        return;
        }

        const validPassword = user.checkPassword(req.body.password);

        if (!validPassword) {
        res.status(400).json({ message: 'check your username or password!' });
        return;
        }

        req.session.save(() => {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.loggedIn = true;

        res.json({ user, message: 'You are now logged in!' });
        });
    } catch (err) {
        res.status(500).json({ message: `there was a problem: ${err}` });
    }
})

//logout
router.post('/logout', (req, res) => {
    try{
        if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).json({message: `User successfully logged out!`});
        });
        } else {
        res.status(404).json({message:'User already logged out'}).end();
        }
    } catch (err) {
        res.status(500).json({message: `there was an error: ${err}`})
    }
});

module.exports = router;