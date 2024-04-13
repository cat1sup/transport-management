const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
// If you plan to add middleware, you can import them here. For example:
// const { validateUser } = require('../middleware/userValidation');

const router = express.Router();

// Apply middleware to routes as needed. For example, using a hypothetical `validateUser` middleware:
// router.post('/register', validateUser, registerUser);

router.post('/register', registerUser);
router.post('/login', loginUser);

// Future routes can be easily added here. For example, a route for user profile update:
// router.put('/update', authenticateUser, updateUser);

module.exports = router;
