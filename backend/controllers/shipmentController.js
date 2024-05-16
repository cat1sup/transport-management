const Shipment = require('../models/Shipment'); // Ensure this path is correct

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll();
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch shipments', error: error.message });
    }
};

exports.addShipment = async (req, res) => {
    const { name, origin, destination } = req.body;
    try {
        const newShipment = await Shipment.create({ name, origin, destination });
        res.status(201).json(newShipment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add shipment', error: error.message });
    }
};
