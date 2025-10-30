const mongoose = require('mongoose');

class SensorData {
  constructor({ timestamp, sensor_id, values, location = null }) {
    if (!timestamp || !sensor_id || !values) {
      throw new Error('timestamp, sensor_id, and values are required');
    }
    this.timestamp = timestamp;
    this.sensor_id = sensor_id;
    this.values = values;
    this.location = location;
  }
}

// Flexible schema to accept your ESP8266 payload
// Example payload shape expected from the device:
// {
//   "timestamp": "2025-10-30T10:00:00Z",
//   "sensor_id": "arduino-uno-001",
//   "values": {
//     "aq2": 123.4,
//     "temperature": 27.5,
//     "humidity": 62.1,
//     "gps": { "latitude": 19.076, "longitude": 72.8777, "altitude": 14.2 }
//   },
//   "location": { "latitude": 19.076, "longitude": 72.8777, "altitude": 14.2 }
// }

const GpsSchema = new mongoose.Schema({
  latitude: { type: Number },
  longitude: { type: Number },
  altitude: { type: Number }
}, { _id: false });

const ValuesSchema = new mongoose.Schema({
  aq2: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
  gps: { type: GpsSchema }
}, { _id: false, strict: false });

const SensorReadingSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  sensor_id: { type: String, required: true },
  values: { type: ValuesSchema, required: true },
  location: { type: GpsSchema }
}, { timestamps: true });

const SensorReading = mongoose.models.SensorReading || mongoose.model('SensorReading', SensorReadingSchema);

module.exports = { SensorData, SensorReading };
