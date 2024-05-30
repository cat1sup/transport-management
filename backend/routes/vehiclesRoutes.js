const express = require('express');
const transportInfoController = require('../controllers/transportInfoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Vehicle routes
router.post('/', authMiddleware, transportInfoController.createVehicle);
router.get('/', authMiddleware, transportInfoController.getVehicles);

module.exports = router;
