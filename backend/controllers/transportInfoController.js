const { Driver, Shipment, Vehicle, Stop, IntermediaryStop } = require('../models');

const nullifyDriverReferences = async (driverId) => {
    await Shipment.update(
        { DesignatedDriverId: null },
        { where: { DesignatedDriverId: driverId } }
    );
};

const nullifyVehicleReferences = async (vehicleId) => {
    await Shipment.update(
        { DesignatedVehicleId: null },
        { where: { DesignatedVehicleId: vehicleId } }
    );
    await Driver.update(
        { VehicleId: null },
        { where: { VehicleId: vehicleId } }
    );
};

const nullifyStopReferences = async (stopId) => {
    await Shipment.update(
        { StartingLocationId: null },
        { where: { StartingLocationId: stopId } }
    );
    await Shipment.update(
        { StoppingLocationId: null },
        { where: { StoppingLocationId: stopId } }
    );
    await IntermediaryStop.destroy({ where: { StopId: stopId } });
};


exports.createStop = async (req, res) => {
    try {
        const newStop = await Stop.create(req.body);
        res.status(201).json(newStop);
    } catch (error) {
        console.error('Error creating stop:', error);
        res.status(500).json({ error: 'Failed to create stop' });
    }
};

exports.getStops = async (req, res) => {
    try {
        const stops = await Stop.findAll();
        res.status(200).json(stops);
    } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({ error: 'Failed to fetch stops' });
    }
};

exports.createDriver = async (req, res) => {
    try {
        const newDriver = await Driver.create(req.body);
        res.status(201).json(newDriver);
    } catch (error) {
        console.error('Error creating driver:', error);
        res.status(500).json({ error: 'Failed to create driver' });
    }
};

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll();
        res.status(200).json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
};


exports.createVehicle = async (req, res) => {
    try {
        const { Name, LicensePlate, Model, Year, Capacity, Status, LastServiceDate, Mileage, InsuranceNumber, InsuranceExpiry } = req.body;
        
        // Ensure the Status field is set, default to 'available' if not provided
        const vehicleData = {
            Name,
            LicensePlate,
            Model,
            Year,
            Capacity,
            Status: Status || 'available',
            LastServiceDate,
            Mileage,
            InsuranceNumber,
            InsuranceExpiry
        };

        const newVehicle = await Vehicle.create(vehicleData);
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
};


exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

exports.updateStop = async (req, res) => {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;

    try {
        const stop = await Stop.findByPk(id);
        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }
        await stop.update({ name, latitude, longitude });
        res.status(200).json({ message: 'Stop updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating stop', error: error.message });
    }
};

// Delete Stop
exports.deleteStop = async (req, res) => {
    const { id } = req.params;

    try {
        // Nullify foreign key references
        await nullifyStopReferences(id);

        // Proceed with stop deletion
        const stop = await Stop.findByPk(id);
        if (!stop) {
            return res.status(404).json({ message: 'Stop not found' });
        }
        await stop.destroy();
        res.status(200).json({ message: 'Stop deleted successfully' });
    } catch (error) {
        console.error('Error deleting stop:', error);
        res.status(500).json({ message: 'Error deleting stop', error: error.message });
    }
};


// Update Driver
exports.updateDriver = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.update({ name });
        res.status(200).json({ message: 'Driver updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating driver', error: error.message });
    }
};

exports.deleteDriver = async (req, res) => {
    const { id } = req.params;

    try {
        // Nullify foreign key references
        await nullifyDriverReferences(id);

        // Proceed with driver deletion
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.destroy();
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ message: 'Error deleting driver', error: error.message });
    }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.update({ name });
        res.status(200).json({ message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        // Nullify foreign key references
        await nullifyVehicleReferences(id);

        // Proceed with vehicle deletion
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        await vehicle.destroy();
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};