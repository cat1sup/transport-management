const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./database');
const userRoutes = require('./routes/userRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const stopsRoutes = require('./routes/stopsRoutes');
const driversRoutes = require('./routes/driversRoutes');
const vehiclesRoutes = require('./routes/vehiclesRoutes');
const { initAssociations } = require('./models');

require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/stops', stopsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/vehicles', vehiclesRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Transport Management System!');
});

// Initialize associations before syncing the database
initAssociations();

sequelize.sync().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error syncing database:', error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something broke!', message: err.message });
});
