const express = require('express')
const routes = express.Router()

// Validators
const PointConfigValidator = require('../validators/Admin/AdminPointConfigValidator')
const PointBonusValidator = require('../validators/Admin/AdminPointBonusValidator')

// Controllers
const PointConfigController = require('../controllers/Admin/AdminPointConfigController')
const PointBonusController = require('../controllers/Admin/AdminPointBonusController')
const { createNotification , deleteNotification, uniqueNotification} = require('../controllers/Admin/AdminNotificationController')

module.exports = () => {
    
    routes.get('/pointsConfig/:site',PointConfigController.show)
    routes.post('/pointsConfig',PointConfigValidator.store, PointConfigController.store)
    routes.delete('/pointsConfig',PointConfigValidator.destroy, PointConfigController.destroy)
    routes.put('/pointsConfig',PointConfigValidator.update, PointConfigController.update)

    routes.post('/pointsBonus',PointBonusValidator.store, PointBonusController.store)
    routes.get('/pointsBonus',PointBonusValidator.store, PointBonusController.show)
    routes.delete('/pointsBonus',PointBonusValidator.store, PointBonusController.destory)
    routes.put('/pointsBonus',PointBonusValidator.store, PointBonusController.update)

    routes.post("/add-notification", createNotification)
    routes.get('/get-notifications', uniqueNotification)
    routes.delete("/delete-notification/:uid",deleteNotification)

    return routes

}