const express = require('express')
const app = express.Router()
const controllers = require('../controllers')
const middlewares = require('../middlewares')

app.route('/user/create')
    .post(middlewares.invites.checkByEmailAndActive, middlewares.users.checkDuplicate, controllers.users.create)

app.route('/user/forgot/password')
    .post(middlewares.users.checkByEmail, controllers.users.forgotPassword)

app.route('/user/reset/password')
    .post(middlewares.users.checkByEmail, middlewares.users.checkTokenHasExpiried, controllers.users.resetPassword)

app.route('/authenticate')
    .post(middlewares.users.checkByEmail, controllers.users.authenticate)

module.exports = app