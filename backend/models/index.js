const Driver = require('./Driver');
const Vehicle = require('./Vehicle');
const Stop = require('./Stop');
const Shipment = require('./Shipment');
const IntermediaryStop = require('./IntermediaryStop');

function initAssociations() {
    Shipment.belongsTo(Driver, { foreignKey: 'DesignatedDriverId', as: 'DesignatedDriver' });
    Shipment.belongsTo(Vehicle, { foreignKey: 'DesignatedVehicleId', as: 'DesignatedVehicle' });
    Shipment.belongsTo(Stop, { foreignKey: 'StartingLocationId', as: 'StartingLocation' });
    Shipment.belongsTo(Stop, { foreignKey: 'StoppingLocationId', as: 'StoppingLocation' });
    Shipment.hasMany(IntermediaryStop, { foreignKey: 'ShipmentId', as: 'IntermediaryStops' });

    IntermediaryStop.belongsTo(Shipment, { foreignKey: 'ShipmentId', as: 'Shipment' });
    IntermediaryStop.belongsTo(Stop, { foreignKey: 'StopId', as: 'Stop' });
}

module.exports = {
    Driver,
    Vehicle,
    Stop,
    Shipment,
    IntermediaryStop,
    initAssociations
};
