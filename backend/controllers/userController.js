const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config(); 


exports.checkSession = (req, res) => {
    if (req.user) {
        res.status(200).json({ isLoggedIn: true, user: req.user });
    } else {
        res.status(401).json({ isLoggedIn: false });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};
 
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
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email or password is incorrect" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' }); 
        res.json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login", error: error.message });
    }
};



exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } 
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

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || !currentPassword) {
            return res.status(400).send({ message: "Please provide both current and new passwords." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(401).send({ message: "Current password is incorrect." });
        }

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

