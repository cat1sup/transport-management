const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Ensure this path is correct for your project structure
require('dotenv').config(); // Ensure dotenv is configured in your entry file or here if not already

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: "User registered successfully", user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering the user", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred during login", error: error.message });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Exclude password for security
        });
        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }
        res.send(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ message: 'Error fetching user details.' });
    }
};

// Update user's password
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.userId;  // Assuming this is set from your auth middleware
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).send({ message: "New password not provided." });
        }

        // Retrieve user from the database
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        // Check if current password matches
        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).send({ message: "Current password is incorrect." });
        }

        // Update password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save();

        res.send({ message: "Password updated successfully." });
    } catch (error) {
        console.error('Failed to update password:', error);
        res.status(500).send({ message: 'Failed to update password.' });
    }
};

