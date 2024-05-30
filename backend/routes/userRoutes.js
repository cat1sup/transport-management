const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/session', authMiddleware, userController.checkSession);
router.post('/logout', authMiddleware, userController.logout);
router.get('/me', authMiddleware, userController.getUserDetails);
router.put('/update-password', authMiddleware, userController.updatePassword);

module.exports = router;
