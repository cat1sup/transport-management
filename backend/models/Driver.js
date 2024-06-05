const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Vehicle = require('./Vehicle');

const Driver = sequelize.define('Driver', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    VehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Allow null values
        references: {
            model: Vehicle,
            key: 'id'
        }
    },
    LicenseType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    HireDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    EmergencyContact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Driver;
