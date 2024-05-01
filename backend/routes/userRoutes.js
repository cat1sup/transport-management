const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// If you plan to add middleware, you can import them here. For example:
// const { validateUser } = require('../middleware/userValidation');

const router = express.Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/me', authMiddleware, userController.getUserDetails);
router.put('/update-password', authMiddleware, userController.updatePassword);

// Future protected or public routes can be easily added here. For example, a route for user profile update:
// router.put('/update', authMiddleware, userController.updateUser);

module.exports = router;
