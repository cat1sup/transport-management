const express = require('express');
const transportInfoController = require('../controllers/transportInfoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, transportInfoController.createVehicle);
router.get('/', authMiddleware, transportInfoController.getVehicles);
router.put('/:id', authMiddleware, transportInfoController.updateVehicle);
router.delete('/:id', authMiddleware, transportInfoController.deleteVehicle); 
module.exports = router;
