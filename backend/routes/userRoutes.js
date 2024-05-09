const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/session', userController.checkSession);
router.post('/logout', userController.logout);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
//router.get('/api/dashboard/data', dashboardController.getDashboardData); 

router.get('/me', authMiddleware, userController.getUserDetails);
router.put('/update-password', authMiddleware, userController.updatePassword);

module.exports = router;
