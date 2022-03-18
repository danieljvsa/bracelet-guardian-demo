const express = require('express')
const routes = express.Router()

const ProfileController = require('./controllers/ProfilesControllers')
const BraceletController = require('./controllers/BraceletsControllers')
const NursesController = require('./controllers/NursesControllers')
const PatientsController = require('./controllers/PatientsControllers')

routes.get('/', ProfileController.index)
routes.get('/get-profiles', ProfileController.get)
routes.post('/add-profile', ProfileController.create)
routes.put('/profiles/:id', ProfileController.update)
routes.delete('/profiles/:id', ProfileController.delete)

routes.get('/get-bracelet', BraceletController.get)
routes.post('/add-bracelet', BraceletController.create)
routes.delete('/bracelets/:id', BraceletController.delete)

routes.get('/get-nurses', NursesController.get)
routes.post('/add-nurse', NursesController.create)
routes.put('/nurses/:id', NursesController.update)
routes.delete('/nurses/:id', NursesController.delete)

routes.get('/patients/:id', PatientsController.get)
routes.post('/patients/:id', PatientsController.create)
routes.delete('/patients/:id', PatientsController.delete)

module.exports = routes;