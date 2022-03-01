const AccessControl = require('accesscontrol');

const roles = new AccessControl();

const ac = () => {
roles.grant('freeUser')
    .createOwn('user', ['*', '!id'])
    .readOwn('user', ['*', '!id'])
    .updateOwn('user', ['*', '!id'])
    .deleteOwn('user')
    .readAny('post', ['*', '!id'])
    .readAny('comment', ['*', '!id'])

roles.grant('paidUser')
    .extend('freeUser')
    .createOwn('post')
    .updateOwn('post')
    .deleteOwn('post')
    .createOwn('comment')
    .updateOwn('comment')
    .deleteOwn('comment')

roles.grant('mod')
    .extend('paidUser')
    .readAny('post', ['*'])
    .deleteAny('post')
    .readAny('comment', ['*'])
    .deleteAny('comment')

roles.grant('admin')
    .extend('mod')
    .createAny('user')
    .readAny('user')
    .updateAny('user')
    .deleteAny('user')

return roles;
}

module.exports = ac
// console.log(roles.getGrants('admin'))