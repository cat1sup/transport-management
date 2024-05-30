const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Stop = sequelize.define('Stop', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
    },
    Latitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
    },
    PostalCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ContactPerson: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Stop;
