const express = require('express');
const transportInfoController = require('../controllers/transportInfoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, transportInfoController.createStop);
router.get('/', authMiddleware, transportInfoController.getStops);
router.put('/:id', authMiddleware, transportInfoController.updateStop);
router.delete('/:id', authMiddleware, transportInfoController.deleteStop);

module.exports = router;
