const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, shipmentController.createShipment);
router.get('/', authMiddleware, shipmentController.getShipments);
router.put('/:id', authMiddleware, shipmentController.updateShipment);
router.delete('/:id', authMiddleware, shipmentController.deleteShipment);

module.exports = router;
