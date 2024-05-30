const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for creating a shipment
router.post('/', authMiddleware, shipmentController.createShipment);

// Route for getting all shipments
router.get('/', authMiddleware, shipmentController.getShipments);

// Route for updating a shipment by ID
router.put('/:id', authMiddleware, shipmentController.updateShipment);

// Route for deleting a shipment by ID
router.delete('/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;
