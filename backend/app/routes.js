const express = require('express');
const mongoose = require('mongoose');
const { SensorData, SensorReading } = require('./models');
const { mergeSensorWithHistory, predictAqiForMonth, getMitigationMeasures } = require('./utils');
const router = express.Router();

// In-memory store for live sensor data submissions
const liveSensorData = [];

// POST /sensor-data
router.post('/sensor-data', async (req, res) => {
  try {
    const data = new SensorData(req.body);
    liveSensorData.push(data);

    // If MongoDB is connected, persist the reading
    if (mongoose.connection.readyState === 1) {
      await SensorReading.create({
        timestamp: new Date(data.timestamp),
        sensor_id: data.sensor_id,
        values: data.values,
        location: data.location || (data.values && data.values.gps) || null
      });
    }

    res.json({ status: 'received', received: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /merged-data
router.get('/merged-data', async (req, res) => {
  try {
    const merged = await mergeSensorWithHistory(liveSensorData);
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /predict-aqi/
router.get('/predict-aqi', (req, res) => {
  const month = parseInt(req.query.month);
  const result = predictAqiForMonth(month);
  if (result == null) {
    return res.json({ error: 'No data for month.' });
  }
  const advice = getMitigationMeasures(result);
  res.json({ month, predicted_aqi: result, mitigation: advice });
});

// GET /mitigation-advice/
router.get('/mitigation-advice', (req, res) => {
  const aqi = parseFloat(req.query.aqi);
  res.json(getMitigationMeasures(aqi));
});

module.exports = router;
