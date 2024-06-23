const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Vehicle = sequelize.define('Vehicle', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LicensePlate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Capacity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('available', 'in-use'),
        allowNull: false,
        defaultValue: 'available'
    },
    LastServiceDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Mileage: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    InsuranceNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    InsuranceExpiry: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Vehicle;
