const vinHistory = require('../models/VinHistory');
const vinService = require('../services/VinService');

exports.decodeVin = async (req, res) => {
    const { vin } = req.body;

    const existingEntry = await vinHistory.findOne({
        userId: req.user.id,
        vin
    })

    if (existingEntry && existingEntry.decodedData) {
        return res.json(existingEntry.decodedData);
    }
    
    const data = typeof vinService.decodeVin === 'function'
        ? await vinService.decodeVin(vin)
        : await vinService(vin);

    if (data) {
        const historyEntry = new vinHistory({
            userId: req.user.id,
            vin,
            decodedData: data
        });
        await historyEntry.save();
    }
    else {
        return res.status(400).json({ message: 'Invalid VIN' });
    }
    res.json(data);
};

exports.getHistory = async (req, res) => {
    if(req.user.id) {
    const history = await vinHistory.find({ userId: req.user.id })
                                    .sort({ createdAt: -1 });
    res.json(history);
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

exports.deleteHistoryEntry = async (req, res) => {
    const { id } = req.params;
    const entry = await vinHistory.findById(id);
    if(entry && entry.userId.toString() === req.user.id) {
        await entry.deleteOne();
        res.json({ message: 'Entry deleted successfully' });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};