const mongoose = require('mongoose');
const EnergyUsage = require('../models/EnergyUsage'); // Adjust path if needed

mongoose.connect('mongodb://127.0.0.1:27017/energyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  const sampleData = [];

  const today = new Date();
  for (let i = 0; i < 30; i++) {
    sampleData.push({
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - i),
      usage: parseFloat((Math.random() * 10 + 5).toFixed(2)),
      device: ['AC', 'Fridge', 'TV', 'Washer'][Math.floor(Math.random() * 4)]
    });
  }

  await EnergyUsage.deleteMany({});
  await EnergyUsage.insertMany(sampleData);
  console.log('✅ Sample energy usage data inserted.');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
