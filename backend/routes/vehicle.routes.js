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
const authenticateToken = require('../middlewares/auth.middleware'); // Importer le middleware

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
 * /vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mark
 *               - modele
 *               - registrationNumber
 *               - rentalPrice
 *             properties:
 *               modele:
 *                 type: string
 *               mark:
 *                 type: string
 *               annee:
 *                 type: integer
 *               rentalPrice:
 *                 type: number
 *               registrationNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Invalid token
 */
router.post('/', authenticateToken, controller.createVehicle);
/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle by ID
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
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
 *         description: Updated successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Invalid token
 *       404:
 *         description: Vehicle not found
 */

router.put('/:id', authenticateToken, controller.updateVehicleById);


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


/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle by ID
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Invalid token
 */
router.delete('/:id', authenticateToken,controller.deleteVehicle);
/**
 * @swagger
 * /vehicles/price/{maxPrice}:
 *   get:
 *     summary: Get all vehicles with rentalPrice <= maxPrice
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: maxPrice
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of filtered vehicles
 */
router.get('/price/:maxPrice', controller.getVehiclesByMaxPrice);


/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehicle data
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getVehicleById);

module.exports = router;
