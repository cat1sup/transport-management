const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for getting shipment history by driver ID
router.get('/driver/:driverId/history', authMiddleware, shipmentController.getDriverHistory);

// Route for getting shipment history by vehicle ID
router.get('/vehicle/:vehicleId/history', authMiddleware, shipmentController.getVehicleHistory);

// Other shipment routes...
router.post('/', authMiddleware, shipmentController.createShipment);
router.get('/', authMiddleware, shipmentController.getShipments);
router.put('/:id', authMiddleware, shipmentController.updateShipment);
router.delete('/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;
