const mongoose = require('mongoose');
const { SensorData, SensorReading } = require('./models');

class SensorPollingService {
  constructor(sensorEndpoint, pollInterval = 5000) {
    this.sensorEndpoint = sensorEndpoint;
    this.pollInterval = pollInterval; // milliseconds
    this.intervalId = null;
    this.isRunning = false;
    this.liveSensorData = []; // Share reference with routes
  }

  /**
   * Start polling the external sensor endpoint
   */
  start(liveSensorDataRef) {
    if (this.isRunning) {
      console.log('⚠️  Sensor polling service is already running');
      return;
    }

    this.liveSensorData = liveSensorDataRef;
    console.log(`🚀 Starting sensor polling service...`);
    console.log(`📡 Polling endpoint: ${this.sensorEndpoint}`);
    console.log(`⏱️  Poll interval: ${this.pollInterval}ms`);

    // Fetch immediately on start
    this.fetchSensorData();

    // Then poll at regular intervals
    this.intervalId = setInterval(() => {
      this.fetchSensorData();
    }, this.pollInterval);

    this.isRunning = true;
  }

  /**
   * Stop polling the sensor endpoint
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('🛑 Sensor polling service stopped');
    }
  }

  /**
   * Fetch sensor data from the external endpoint
   */
  async fetchSensorData() {
    try {
      console.log(`📥 Fetching sensor data from ${this.sensorEndpoint}...`);
      
      const response = await fetch(this.sensorEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      let sensorReadings = [];
      
      if (Array.isArray(data)) {
        // If response is an array of readings
        sensorReadings = data;
      } else if (data.data && Array.isArray(data.data)) {
        // If response is wrapped in a data property
        sensorReadings = data.data;
      } else if (data.success && data.data) {
        // If response has success flag and data
        sensorReadings = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data.timestamp || data.sensor_id) {
        // Single reading
        sensorReadings = [data];
      } else {
        console.log('⚠️  Unknown response format:', data);
        return;
      }

      if (sensorReadings.length === 0) {
        console.log('ℹ️  No new sensor data available');
        return;
      }

      // Process each reading
      for (const reading of sensorReadings) {
        await this.processSensorReading(reading);
      }

      console.log(`✅ Successfully processed ${sensorReadings.length} sensor reading(s)`);
      
    } catch (error) {
      console.error('❌ Error fetching sensor data:', error.message);
      
      // Don't crash the service on errors, just log and continue
      if (error.code === 'ECONNREFUSED') {
        console.error('   Connection refused. Is the sensor endpoint running?');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('   Request timed out. Check network connection.');
      }
    }
  }

  /**
   * Process and store a single sensor reading
   */
  async processSensorReading(reading) {
    try {
      // Normalize the reading format
      const normalizedReading = this.normalizeReading(reading);
      
      // Create SensorData instance
      const sensorData = new SensorData(normalizedReading);
      
      // Add to in-memory store (keep last 100 readings)
      this.liveSensorData.push(sensorData);
      if (this.liveSensorData.length > 100) {
        this.liveSensorData.shift(); // Remove oldest
      }

      // Persist to MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        await SensorReading.create({
          timestamp: new Date(sensorData.timestamp),
          sensor_id: sensorData.sensor_id,
          values: sensorData.values,
          location: sensorData.location || (sensorData.values && sensorData.values.gps) || null
        });
        console.log(`💾 Saved reading from sensor: ${sensorData.sensor_id}`);
      }
      
    } catch (error) {
      console.error('❌ Error processing sensor reading:', error.message);
    }
  }

  /**
   * Normalize different sensor reading formats to a consistent structure
   */
  normalizeReading(reading) {
    // Handle timestamp
    const timestamp = reading.timestamp || reading.time || new Date().toISOString();
    
    // Handle sensor_id
    const sensor_id = reading.sensor_id || reading.sensorId || reading.id || 'external-sensor-001';
    
    // Handle values - could be nested or flat
    let values = {};
    
    if (reading.values) {
      values = reading.values;
    } else {
      // Extract sensor values from flat structure
      values = {
        aq2: reading.aq2 || reading.gasAq2Ppm || reading.gas || null,
        temperature: reading.temperature || reading.temperatureC || reading.temp || null,
        humidity: reading.humidity || reading.humidityPct || null,
      };
      
      // Handle GPS data
      if (reading.gps || reading.location) {
        const gpsData = reading.gps || reading.location;
        if (gpsData.latitude !== undefined && gpsData.longitude !== undefined) {
          values.gps = {
            latitude: gpsData.latitude || gpsData.lat,
            longitude: gpsData.longitude || gpsData.lng || gpsData.lon,
            altitude: gpsData.altitude || gpsData.alt || 0
          };
        }
      }
    }
    
    // Handle location
    let location = null;
    if (reading.location && reading.location.latitude !== undefined) {
      location = {
        latitude: reading.location.latitude,
        longitude: reading.location.longitude,
        altitude: reading.location.altitude || 0
      };
    } else if (values.gps) {
      location = values.gps;
    }
    
    return {
      timestamp,
      sensor_id,
      values,
      location
    };
  }

  /**
   * Get current status of the polling service
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      endpoint: this.sensorEndpoint,
      pollInterval: this.pollInterval,
      dataPointsStored: this.liveSensorData.length
    };
  }
}

module.exports = SensorPollingService;

