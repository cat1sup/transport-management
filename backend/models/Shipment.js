const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Shipment = sequelize.define('Shipment', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    origin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Shipment;
