const mangoose = require('mongoose');

const vinHistorySchema = new mangoose.Schema({
    userId: { type: mangoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vin: { type: String, required: true },
    decodedData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mangoose.model('VinHistory', vinHistorySchema);