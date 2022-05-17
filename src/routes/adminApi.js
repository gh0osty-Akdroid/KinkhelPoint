const express = require('express')
const routes = express.Router()

// Validators
const PointConfigValidator = require('../validators/Admin/AdminPointConfigValidator')
const PointBonusValidator = require('../validators/Admin/AdminPointBonusValidator')

// Controllers
const PointConfigController = require('../controllers/Admin/AdminPointConfigController')
const PointBonusController = require('../controllers/Admin/AdminPointBonusController')

module.exports = () => {
    
    routes.get('/pointsConfig/:site',PointConfigController.show)
    routes.post('/pointsConfig',PointConfigValidator.store, PointConfigController.store)
    routes.delete('/pointsConfig',PointConfigValidator.destroy, PointConfigController.destroy)
    routes.put('/pointsConfig',PointConfigValidator.update, PointConfigController.update)

    routes.post('/pointsBonus',PointBonusValidator.store, PointBonusController.store)

    return routes

}