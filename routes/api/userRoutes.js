
//I have commented out all of the AccessControl stuff for the moment: I'm still 
//working on modularizing it so we don't have to have it in every routes folder.
const router = require('express').Router();
const jwt = require("jsonwebtoken");
const { hasAccess, verifyToken } = require('../../middlewares/authJWT');
const { User, Post, Comment, Relationship, FlaggedUser } = require('../../models/');

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/gettokendata", verifyToken, (req, res) => {
    console.log('req.headers', req.headers);
    console.log('req.userId', req.userId);
    console.log('req.role', req.role);
    console.log('req.username', req.username);
    res.status(200).json({
        username: req.username,
        userId: req.userId,
        role: req.role
    })



});

//get all users (admin role only)
router.get('/', verifyToken, async (req, res) => {
    try {
        if (hasAccess(req.role, 'readAny', 'user')) {
            const userData = await User.findAll({
                include: [Post, Comment]
            });
            if (!userData) {
                res.status(404).json({ message: 'No users found!' })
            } else {
                res.status(200).json(userData);
            }
        } else {
            res.status(403).json({ message: 'User not authorized for this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//get user by id (anyone can get their own user, only admin can ger ANY user)
router.get('/:id', verifyToken, async (req, res) => {
    try {
        if ((req.userId === parseInt(req.params.id)) || (hasAccess(req.role, 'readAny', 'user'))) {
            const getUser = async () => {
                const userData = await User.findByPk(req.params.id, {
                    attributes: ['username'],
                    include: [Post, Comment, {
                        model: Relationship,
                        as: 'active_relationships',
                        // include: [{
                        //     model: User,
                        //     as: ''
                        // }]
                    },
                        {
                        model: User,
                        as: 'following',
                        attributes: ['username'],
                        include: [{
                            model: Post,
                            attributes: ['id', 'title']
                        }]
                        }],
                });
                if (!userData) {
                    res.status(404).json({ message: 'No users found!' })
                } else {
                    res.status(200).json(userData);
                }
            }
            getUser();
        } else {
            res.status(403).json({ message: 'User not authorized for this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
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
    try {
        const newUser = await User.create({ ...req.body });
        if (newUser) {
            const token = jwt.sign({ id: newUser.id, role: newUser.role, username: newUser.username }, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_MAX_AGE
            });
            res.status(200).json({
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                // auth: true,
                accessToken: token
            })
        } else { res.status(400).json({ message: 'Not all required data was recieved!' }) }
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
                res.status(200).json({ message: `User updated successfully!` });
            } else {
                res.status(404).json({ message: `That user not found!` });
            }
        }
        if ((req.userId === req.params.id) || (hasAccess(req.role, 'updateAny', 'user'))) {
            updateUser();
        } else {
            res.status(403).json({ message: 'User not authorized for this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//delete user account: any user can delete their own user, only admin can delete ANY account (we can assign what actually happens when we send a "delete" request: this should probably just deactivate the person's account and archive it)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleteUser = () => {
            const user = User.destroy({
                where: {
                    id: req.params.id,
                },
            });

            if (user) {
                res.status(200).json({ message: `User has been deleted!` }).end();
            } else {
                res.status(404).json({ message: `No user with that ID found!` });
            }
        }
        if ((req.userId === req.params.id) || (hasAccess(req.role, 'deleteAny', 'user'))) {
            deleteUser();
        } else {
            res.status(403).json({ message: 'User not authorized for this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error!: ${err}` });
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const user = await User.findOne({
            where: {
                username: req.body.username,
            }
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
            const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.SECRET_KEY, {
                expiresIn: process.env.TOKEN_MAX_AGE
            });

            res.status(200).json({
                id: user.id,
                username: user.username,
                role: user.role,
                accessToken: token
            })
        }
    } catch (err) {
        res.status(500).json({ message: `there was a problem: ${err}` });
    }
})

//follow existing user
router.post('/follow/:id', verifyToken, async (req, res) => {
    try {
        console.log('we\'re in the friend route!')
        const followAuthor = await Relationship.findOne({
            where: {
                follower_id: req.userId,
                followed_id: req.params.id
            }
        })
        console.log('followAuthor', followAuthor)
        if (followAuthor === null) {
            Relationship.create({
                follower_id: req.userId,
                followed_id: req.params.id
            })
            res.status(200).json({ message: 'You have followed the author!' })
        } else { res.status(400).json({ message: 'You are already following this author.' }) }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//unfollow user
router.delete('/unfollow/:id', verifyToken, async (req, res) => {
    try {
        console.log('we\'re in the unfriend route!')
        const unfollow = Relationship.destroy({
            where: {
                follower_id: req.userId,
                followed_id: req.params.id
            },
        });

        if (unfollow) {
            res.status(200).json({ message: `You have unfollowed the author!` }).end();
        } else {
            res.status(404).json({ message: `No user with that ID found!` });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//flag user
router.put('/flag/:id', verifyToken, async (req, res) => {

    try {
        if ((hasAccess(req.role, 'updateAny', 'user'))) {
            const user = await User.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            if (user) {
                FlaggedUser.create({
                    mod_id: req.userId,
                    user_id: req.params.id
                })
                res.status(200).json({ message: 'user flagged' }).end();
            } else {
                res.status(404).json({ message: `That user not found!` }).end();
            }
        } else {
            res.status(400).json({ message: 'This user has already been flagged.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

//unflag user
router.put('/unflag/:id', verifyToken, async (req, res) => {
    try {
        console.log('this is the put request', req.params.id)
        // const alreadyFlagged = await FlaggedUser.findOne({
        //     where: {
        //         user_id: req.params.id
        //     }
        // })
        if (hasAccess(req.role, 'updateAny', 'user')) {
            const user = await User.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            if (user) {
                FlaggedUser.destroy({
                    where: {
                        user_id: user.id
                    }
                })
                res.status(200).json({ message: 'user unflagged' }).end();
            } else {
                res.status(404).json({ message: `That user not found!` }).end();
            }
        } else {
            res.status(403).json({ message: 'You cannot perform this action.' })
        }
    } catch (err) {
        res.status(500).json({ message: `There was an error: ${err}` });
    }
});

module.exports = router;