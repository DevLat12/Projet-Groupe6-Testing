//const express = require('express');
//const router = express.Router();
//const controller = require('../controllers/vehicle.controller');

// router.post('/', controller.createVehicle);
// router.get('/', controller.getAllVehicles);
// router.get('/:id', controller.getVehicleById);
// router.put('/:id', controller.updateVehicle);
// router.delete('/:id', controller.deleteVehicle);
//router.get('/search/:registrationNumber', controller.searchByRegistration);
// router.get('/price/:maxPrice', controller.getVehiclesByMaxPrice);

// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicle.controller');

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', controller.getAllVehicles);


/**
 * @swagger
 * /vehicles/search/{registrationNumber}:
 *   get:
 *     summary: Search vehicle by registration number
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: registrationNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle found
 */
router.get('/search/:registrationNumber', controller.searchByRegistration);



 module.exports = router;
