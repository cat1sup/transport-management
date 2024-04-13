const express = require('express');
const sequelize = require('./database'); // Adjust the path as per your project structure
const User = require('./models/User'); // Import all models
const userRoutes = require('./routes/userRoutes'); // Ensure this is the correct path

const app = express();

// Middlewares
app.use(express.json()); // For parsing application/json

// Use user routes
app.use('/api/users', userRoutes);

// Define a simple route to test server response
app.get('/', (req, res) => {
    res.send('Welcome to the Transport Management System!');
});

// Start listening on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
