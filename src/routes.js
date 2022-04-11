const express = require('express')
const routes = express.Router()

const ProfileController = require('./controllers/ProfilesControllers')
const BraceletController = require('./controllers/BraceletsControllers')
const NursesController = require('./controllers/NursesControllers')
const PatientsController = require('./controllers/PatientsControllers')

routes.get('/', ProfileController.index) //web routes
routes.get('/get-profiles', ProfileController.get) //web routes
routes.post('/add-profile', ProfileController.create) //web routes
routes.put('/profiles/:id', ProfileController.update) //web routes
routes.delete('/profiles/:id', ProfileController.delete) //web routes

routes.get('/get-bracelet', BraceletController.get) //web routes
routes.post('/add-bracelet', BraceletController.create) //esp32 routes
routes.delete('/bracelets/:id', BraceletController.delete) //web routes

routes.get('/get-nurses', NursesController.get) //web routes
routes.post('/add-nurse', NursesController.create) //web routes
routes.put('/nurses/:id', NursesController.update) //web routes
routes.delete('/nurses/:id', NursesController.delete) //web routes

routes.get('/patients/:id', PatientsController.get) //web routes
routes.post('/alert', PatientsController.create) //esp32 routes
routes.post('/test-alert', PatientsController.test_create) //esp32 routes
routes.post('/test', PatientsController.test) //esp32 test connection route
routes.delete('/patients-data/:id', PatientsController.delete) //web routes

module.exports = routes;