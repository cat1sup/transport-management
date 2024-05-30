const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const IntermediaryStop = sequelize.define('IntermediaryStop', {
    ShipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    StopId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = IntermediaryStop;
