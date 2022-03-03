const jwt = require("jsonwebtoken");
const AccessControl = require('accesscontrol');
const ac = new AccessControl();


////the different "roles" in our db model are defined and permissed here
ac.grant('freeUser')
    .createOwn('user', ['*', '!id'])
    .readOwn('user', ['*', '!id'])
    .updateOwn('user', ['*', '!id'])
    .deleteOwn('user')
    .readAny('post', ['*', '!id'])
    .readAny('comment', ['*', '!id'])

ac.grant('paidUser')
    .extend('freeUser')
    .createOwn('post')
    .updateOwn('post')
    .deleteOwn('post')
    .createOwn('comment')
    .updateOwn('comment')
    .deleteOwn('comment')

ac.grant('mod')
    .extend('paidUser')
    .readAny('post', ['*'])
    .deleteAny('post')
    .readAny('comment', ['*'])
    .deleteAny('comment')

ac.grant('admin')
    .extend('mod')
    .createAny('user')
    .readAny('user')
    .updateAny('user')
    .deleteAny('user')

////////this fxn verifies whether or not a particular role can perform a particular action on a specified resource (e.g. user, post, or comment)
const hasAccess = (role, action, resource) =>{
    const permission = ac.can(role)[action](resource);
    if(permission.granted){
        return true
    } else {
        return false
    }
}


///////this fxn verifies that the user has a valid JWT and gets the needed info out of it to complete the request (which it passes on to the next fxn)
const verifyToken = (req, res, next) => {
    // console.log('===========this is the request', req)
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
        message: "No token provided!"
        });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({auth: false,
            message: "Please login to view."
            });
        } else {
        req.userId = decoded.id;
        req.role = decoded.role;
            
        next();
        }
    });
};


//////this fxn is here, but may not be needed. It basically will console.log the specified users' approved permissions
const roleGrants = (role, action) => {
    const grants = ac.getGrants();
    const userGrants = grants[role].user
    console.log('grants', userGrants)
    console.log(action in userGrants)
}

const authJwt = {
    verifyToken: verifyToken,
    hasAccess: hasAccess,
    roleGrants: roleGrants
  };

  module.exports = authJwt;