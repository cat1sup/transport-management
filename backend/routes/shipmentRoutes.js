const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, shipmentController.getShipments);
router.post('/', authMiddleware, shipmentController.addShipment);

module.exports = router;
