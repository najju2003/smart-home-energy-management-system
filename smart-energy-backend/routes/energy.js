const express = require('express');
const router = express.Router();
const EnergyData = require('../models/EnergyData');
const { spawn } = require('child_process'); // make sure this line is near top

router.post('/predict', async (req, res) => {
  const { actualUsage, devices } = req.body;

  const python = spawn('python', ['./ml/predict.py']);
  let predicted = '';

  // Read prediction output
  python.stdout.on('data', (data) => {
    predicted += data.toString();
  });

  // Log any Python errors
  python.stderr.on('data', (err) => {
    console.error("Python error:", err.toString());
  });

  // When Python finishes
  python.on('close', async () => {
    predicted = predicted.trim();

    // Handle invalid output
    if (!predicted || predicted === "error" || isNaN(parseFloat(predicted))) {
      return res.status(500).json({ error: "Prediction failed" });
    }

    try {
      const predictedUsage = parseFloat(predicted);
      const EnergyData = require('../models/EnergyData'); // add if missing

      const newRecord = new EnergyData({
        actualUsage,
        predictedUsage,
        devices
      });

      await newRecord.save();
      console.log("✅ Prediction result being sent:", predictedUsage);
      res.json({ message: "Data saved", predictedUsage });
    } catch (err) {
      console.error("DB Save Error:", err);
      res.status(500).json({ error: "Save failed" });
    }
  });
});

// GET device-wise energy usage
router.get('/summary/monthly', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const data = await EnergyData.find({ timestamp: { $gte: startOfMonth } });
    if (!data || data.length === 0) {
      return res.json({ total: "0", avgPerDay: "0", maxUsage: "0", days: 0 });
    }

    const total = data.reduce((sum, d) => sum + (d.actualUsage || 0), 0);
    const days = new Set(data.map(d => new Date(d.timestamp).toDateString()));
    const avgPerDay = total / days.size;
    const maxUsage = Math.max(...data.map(d => d.actualUsage || 0));

    res.json({
      total: total.toFixed(2),
      avgPerDay: avgPerDay.toFixed(2),
      maxUsage: maxUsage.toFixed(2),
      days: days.size
    });
  } catch (err) {
    console.error("Monthly stats error:", err);
    res.status(500).json({ error: "Failed to calculate monthly stats" });
  }
});

module.exports = router;