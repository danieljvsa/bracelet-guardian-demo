const express = require('express')
const app = express.Router()
const controllers = require('../controllers')
const middlewares = require('../middlewares')

app.route('/alert')
    .post(middlewares.bracelets.checkMacAddressAndPatient, controllers.alerts.create)

module.exports = app