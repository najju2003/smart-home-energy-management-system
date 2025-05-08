const mongoose = require('mongoose');

const energySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  actualUsage: Number,
  predictedUsage: Number,
  devices: [
    {
      deviceId: String,
      power: Number,
      duration: Number
    }
  ]
});

module.exports = mongoose.model('EnergyData', energySchema);
