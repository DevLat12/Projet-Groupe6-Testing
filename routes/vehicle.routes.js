// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/vehicle.controller');

// router.post('/', controller.createVehicle);
// router.get('/', controller.getAllVehicles);
// router.get('/:id', controller.getVehicleById);
// router.put('/:id', controller.updateVehicle);
// router.delete('/:id', controller.deleteVehicle);
// router.get('/search/:registrationNumber', controller.searchByRegistration);
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
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle by ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mark:
 *                 type: string
 *               modele:
 *                 type: string
 *               annee:
 *                 type: integer
 *               rentalPrice:
 *                 type: number
 *               registrationNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', controller.updateVehicleById);

 module.exports = router;
