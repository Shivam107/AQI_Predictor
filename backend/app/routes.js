const express = require('express');
const mongoose = require('mongoose');
const { SensorData, SensorReading } = require('./models');
const { mergeSensorWithHistory, predictAqiForMonth, getMitigationMeasures } = require('./utils');
const router = express.Router();

// In-memory store for live sensor data submissions (shared with polling service)
const liveSensorData = [];

// Export function to get reference to liveSensorData array
function getLiveSensorDataRef() {
  return liveSensorData;
}

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

// GET /sensor-data/latest - returns the most recent sensor reading
router.get('/sensor-data/latest', async (req, res) => {
  try {
    let latestReading = null;
    
    // Try MongoDB first if connected
    if (mongoose.connection.readyState === 1) {
      latestReading = await SensorReading.findOne()
        .sort({ timestamp: -1 })
        .limit(1);
    }
    
    // Fallback to in-memory if no DB reading
    if (!latestReading && liveSensorData.length > 0) {
      const latest = liveSensorData[liveSensorData.length - 1];
      latestReading = {
        timestamp: latest.timestamp,
        sensor_id: latest.sensor_id,
        values: latest.values,
        location: latest.location
      };
    }
    
    if (latestReading) {
      res.json({ 
        success: true, 
        data: latestReading 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'No sensor data available' 
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /merged-data (with optional city filter)
router.get('/merged-data', async (req, res) => {
  try {
    let merged = await mergeSensorWithHistory(liveSensorData);
    
    // Filter by city if provided
    const city = req.query.city;
    if (city && city !== 'All Cities') {
      merged = merged.filter(record => 
        record.City && record.City.toLowerCase() === city.toLowerCase()
      );
    }
    
    res.json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /cities - Get list of available cities
router.get('/cities', async (req, res) => {
  try {
    const merged = await mergeSensorWithHistory(liveSensorData);
    const cities = [...new Set(merged.map(record => record.City).filter(Boolean))];
    cities.sort();
    res.json({ cities: ['All Cities', ...cities] });
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

// GET /sensor-polling/status - Get status of the sensor polling service
router.get('/sensor-polling/status', (req, res) => {
  try {
    const pollingService = req.app.locals.sensorPollingService;
    
    if (!pollingService) {
      return res.json({
        success: false,
        message: 'Sensor polling service not initialized'
      });
    }
    
    const status = pollingService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
module.exports.getLiveSensorDataRef = getLiveSensorDataRef;
