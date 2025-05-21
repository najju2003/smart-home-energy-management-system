const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://naseeroddin:Yallah@123@cluster0.nmwimcs.mongodb.net/smartenergy?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Mongoose schema
const energySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  deviceId: String,
  label: String,
  wattage: Number,
  totalWattage: Number
});

const EnergyData = mongoose.model('EnergyData', energySchema);

// Route: POST /record-energy
app.post('/record-energy', async (req, res) => {
  const { deviceId, label, wattage } = req.body;
  try {
    const newEntry = new EnergyData({ deviceId, label, wattage });
    await newEntry.save();
    res.json({ message: 'Energy recorded successfully' });
  } catch (err) {
    console.error('Error saving energy data:', err);
    res.status(500).json({ message: 'Failed to record energy' });
  }
});

// Route: GET /monthly-stats
app.get('/monthly-stats', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth();
    const stats = await EnergyData.aggregate([
      {
        $match: {
          timestamp: {
            $gte: new Date(new Date().getFullYear(), currentMonth, 1),
            $lt: new Date(new Date().getFullYear(), currentMonth + 1, 1)
          }
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$timestamp" } },
          total: { $sum: "$wattage" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    console.error('Error getting monthly stats:', err);
    res.status(500).json({ message: 'Failed to load monthly stats' });
  }
});

// Route: GET /device-usage
app.get('/device-usage', async (req, res) => {
  try {
    const usage = await EnergyData.aggregate([
      {
        $group: {
          _id: "$label",
          total: { $sum: "$wattage" }
        }
      },
      { $sort: { total: -1 } }
    ]);
    res.json(usage);
  } catch (err) {
    console.error('Error getting device usage:', err);
    res.status(500).json({ message: 'Failed to load device usage' });
  }
});

// ✅ Route: POST /predict (fixed)

const { spawn } = require('child_process');

app.post('/predict', (req, res) => {
  const py = spawn('python3', ['ml/predict.py']);

  let result = '';
  let error = '';

  py.stdout.on('data', (data) => {
    result += data.toString();
  });

  py.stderr.on('data', (data) => {
    error += data.toString();
  });

  py.on('close', (code) => {
    if (error || code !== 0) {
      console.error('Python script error:', error || `Exit code: ${code}`);
      return res.status(500).json({ message: 'Prediction failed' });
    }

    const predicted = parseFloat(result.trim());
    if (isNaN(predicted)) {
      return res.status(500).json({ message: 'Invalid prediction result' });
    }

    res.json({ predicted });
  });
});


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

//connecting front to backend
const path = require('path');
app.use(express.static(path.join(__dirname, '../smart-energy-frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../smart-energy-frontend/index.html'));
});

