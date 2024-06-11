const { Shipment, IntermediaryStop, Driver, Vehicle, Stop, Op } = require('../models');

exports.createShipment = async (req, res) => {
    const { shipmentData, stops } = req.body;
    console.log('Creating shipment:', shipmentData, stops);
    
    const convertEmptyToNull = (value) => (value === '' ? null : value);

    try {
        const newShipment = await Shipment.create({
            ...shipmentData,
            DesignatedDriverId: convertEmptyToNull(shipmentData.DesignatedDriverId),
            DesignatedVehicleId: convertEmptyToNull(shipmentData.DesignatedVehicleId),
            StartingLocationId: convertEmptyToNull(shipmentData.StartingLocationId),
            StoppingLocationId: convertEmptyToNull(shipmentData.StoppingLocationId),
        });

        if (stops && stops.length > 0) {
            const newStops = stops.map(stop => ({
                ShipmentId: newShipment.id,
                StopId: stop.StopId
            }));
            await IntermediaryStop.bulkCreate(newStops);
        }

        res.status(201).json({ message: 'Shipment created successfully', shipment: newShipment });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ message: 'Error creating shipment', error: error.message });
    }
};

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
            include: [
                { model: IntermediaryStop, as: 'IntermediaryStops', include: { model: Stop, as: 'Stop' } },
                { model: Driver, as: 'DesignatedDriver' },
                { model: Vehicle, as: 'DesignatedVehicle' },
                { model: Stop, as: 'StartingLocation' },
                { model: Stop, as: 'StoppingLocation' }
            ]
        });
        res.status(200).json(shipments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching shipments', error: error.message });
    }
};

exports.updateShipment = async (req, res) => {
    const { id } = req.params;
    const { shipmentData, stops } = req.body;

    try {
        await Shipment.update(shipmentData, { where: { id } });

        if (stops && stops.length > 0) {
            await IntermediaryStop.destroy({ where: { ShipmentId: id } });
            const newStops = stops.map(stop => ({
                ShipmentId: id,
                StopId: stop.StopId
            }));
            await IntermediaryStop.bulkCreate(newStops);
        }

        res.status(200).json({ message: 'Shipment updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating shipment', error: error.message });
    }
};

exports.deleteShipment = async (req, res) => {
    const { id } = req.params;

    try {
        await IntermediaryStop.destroy({ where: { ShipmentId: id } });
        await Shipment.destroy({ where: { id } });
        res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting shipment', error: error.message });
    }
};

exports.getTransportInfo = async (req, res) => {
    try {
        const stops = await Stop.findAll();
        const drivers = await Driver.findAll();
        const vehicles = await Vehicle.findAll();

        res.status(200).json({ stops, drivers, vehicles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching transport info', error: error.message });
    }
};

