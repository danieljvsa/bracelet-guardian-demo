const express = require('express')
const app = express.Router()
const controllers = require('../controllers')
const middlewares = require('../middlewares')

app.use(middlewares.auth.validateAdmin)

app.route('/organization')
    .post(middlewares.organizations.checkDuplicate, controllers.organizations.create)

app.route('/organization/:orgId')
    .get(middlewares.organizations.checkByParams, controllers.organizations.get)
    .put(middlewares.organizations.checkByParams, controllers.organizations.update)

app.route('/organizations')
    .get(middlewares.organizations.getOrganizationsList, controllers.organizations.getAll)

app.route('/organization/generate/key/:orgId')
    .put(middlewares.organizations.checkByParams, controllers.organizations.generateApiKey)

module.exports = app