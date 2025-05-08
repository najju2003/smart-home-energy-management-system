const mongoose = require('mongoose');

const energyUsageSchema = new mongoose.Schema({
  date: Date,
  usage: Number,
  device: String
});

module.exports = mongoose.model('EnergyUsage', energyUsageSchema);
