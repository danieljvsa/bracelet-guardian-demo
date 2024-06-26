const express = require('express')
const app = express.Router()
const controllers = require('../controllers')
const middlewares = require('../middlewares')

app.use(middlewares.auth.validateUser)

app.route('/users')
    .get(middlewares.users.getUsersList, controllers.users.getAll)

app.route('/user/:userId')
    .get(middlewares.users.checkByParams, controllers.users.get)
    .delete(middlewares.users.checkByParams, controllers.users.delete)

app.route('/invite/:inviteId')
    .get(middlewares.invites.checkByParams, controllers.invites.get)
    .put(middlewares.invites.checkByParams, controllers.invites.update)
    .delete(middlewares.invites.checkByParams, controllers.invites.delete)

app.route('/invites')
    .get(middlewares.invites.getInvitesList, controllers.invites.getAll)

app.route('/invite')
    .post(middlewares.invites.checkEmailAndActive, controllers.invites.create)

app.route('/invite/resend/:inviteId')
    .get(middlewares.invites.checkByParams, controllers.invites.resend)

module.exports = app