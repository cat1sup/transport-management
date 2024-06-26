const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Shipment = sequelize.define('Shipment', {
    ShipmentNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CargoType: {
        type: DataTypes.ENUM('perishable', 'containerized', 'dry bulk', 'liquid bulk', 'dangerous', 'special purpose', 'livestock'),
        allowNull: false
    },
    CargoWeight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    NumberOfPallets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    DesignatedDriverId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DesignatedVehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true  
    },
    StartingLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true  
    },
    StoppingLocationId: {
        type: DataTypes.INTEGER,
        allowNull: true  
    },
    Status: {
        type: DataTypes.ENUM('Planned', 'Ongoing', 'Finished'),
        allowNull: false,
        defaultValue: 'Planned'
    }
}, {
    timestamps: true
});

module.exports = Shipment;
