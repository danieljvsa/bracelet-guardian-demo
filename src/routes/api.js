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

app.route('/organizations')
    .get(middlewares.organizations.checkAdminOrganization, middlewares.organizations.getOrganizationsList, controllers.organizations.getAll)

app.route('/patient')
    .post(middlewares.patients.checkDuplicate, controllers.patients.create)

app.route('/patient/:patientId')
    .get(middlewares.patients.checkByParams, controllers.patients.get)
    .put(middlewares.patients.checkByParams, controllers.patients.update)
    .delete(middlewares.patients.checkByParams, controllers.patients.delete)

app.route('/patients')
    .get(middlewares.patients.getPatientsList, controllers.patients.getAll)

app.route('/nurse')
    .post(middlewares.nurses.checkDuplicate, middlewares.nurses.checkDivision, controllers.nurses.create)

app.route('/nurse/:nurseId')
    .get(middlewares.nurses.checkByParams, controllers.nurses.get)
    .put(middlewares.nurses.checkByParams, controllers.nurses.update)
    .delete(middlewares.nurses.checkByParams, controllers.nurses.delete)

app.route('/nurses')
    .get(middlewares.nurses.getNursesList, controllers.nurses.getAll)

app.route('/bracelet/:patientId')
    .post(middlewares.patients.checkByParams, middlewares.bracelets.checkDuplicate, controllers.bracelets.create)

app.route('/bracelet/:braceletId')
    .get(middlewares.bracelets.checkByParams, controllers.bracelets.get)
    .put(middlewares.bracelets.checkByParams, controllers.bracelets.update)

app.route('/bracelets')
    .get(middlewares.bracelets.getBraceletsList, controllers.bracelets.getAll)

app.route('/bracelets/patient/:patientId')
    .get(middlewares.patients.checkByParams, middlewares.bracelets.getBraceletsByPatient, controllers.bracelets.getAll)

app.route('/alert/:alertId')
    .get(middlewares.alerts.checkByParams, controllers.alerts.get)

app.route('/alerts/bracelet/:braceletId')
    .get(middlewares.bracelets.checkByParams, middlewares.alerts.getAlertsListByBracelet, controllers.alerts.getAll)

app.route('/alerts/patient/:patientId')
    .get(middlewares.patients.checkByParams, middlewares.alerts.getAlertsByPatient, controllers.alerts.getAll)

module.exports = app