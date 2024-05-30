const express = require('express');
const transportInfoController = require('../controllers/transportInfoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Driver routes
router.post('/', authMiddleware, transportInfoController.createDriver);
router.get('/', authMiddleware, transportInfoController.getDrivers);

module.exports = router;
