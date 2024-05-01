const express = require('express');
const sequelize = require('./database'); // Make sure this path correctly leads to your Sequelize setup
const User = require('./models/User'); // Import your user model correctly
const userRoutes = require('./routes/userRoutes'); // Make sure routes are set up correctly
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Use routes defined in other files
app.use('/api/users', userRoutes);

// Simple root route to test server availability
app.get('/', (req, res) => {
    res.send('Welcome to the Transport Management System!');
});

// Sync database and start the server
sequelize.sync().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error syncing database:', error);
});

// General error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!', message: err.message });
});
