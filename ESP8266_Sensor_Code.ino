#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <time.h>

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API endpoint - Replace with your actual Render URL
const char* serverUrl = "https://your-backend.onrender.com/api/sensor-data";

// Sensor ID (unique for each device)
const char* sensorId = "esp8266-001";

// Timing - Send data every 3 seconds
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 3000; // 3 seconds (3000 milliseconds)

// NTP Time Server Configuration
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;  // IST = UTC + 5:30 hours = 19800 seconds
const int daylightOffset_sec = 0;

// ============================================

WiFiClientSecure wifiClient;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println();
  Serial.println("========================================");
  Serial.println("ESP8266 Sensor Data Logger");
  Serial.println("Send Interval: 3 seconds");
  Serial.println("========================================");
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup time synchronization with NTP
  setupTime();
  
  // Disable SSL certificate verification (for testing)
  // For production, you should verify certificates
  wifiClient.setInsecure();
  
  Serial.println("Setup complete. Starting data transmission...");
  Serial.println();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectToWiFi();
  }
  
  // Send data every 3 seconds
  if (millis() - lastSendTime >= sendInterval) {
    sendSensorData();
    lastSendTime = millis();
  }
  
  delay(100);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("✓ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println();
    Serial.println("✗ WiFi connection failed!");
  }
}

void setupTime() {
  Serial.print("Syncing time with NTP server");
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  
  int attempts = 0;
  while (time(nullptr) < 1000000000 && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (time(nullptr) >= 1000000000) {
    Serial.println(" Done!");
    Serial.print("Current time: ");
    Serial.println(getCurrentTimestamp());
  } else {
    Serial.println(" Failed!");
    Serial.println("Warning: Time sync failed. Using approximate timestamps.");
  }
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ WiFi not connected. Cannot send data.");
    return;
  }
  
  // Read sensor values (replace with your actual sensor readings)
  float aq2 = readAQ2Sensor();
  float temperature = readTemperature();
  float humidity = readHumidity();
  
  // GPS coordinates (replace with actual GPS module readings if available)
  float latitude = 19.076;
  float longitude = 72.8777;
  float altitude = 14.2;
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  
  // Get current timestamp (ISO 8601 format)
  doc["timestamp"] = getCurrentTimestamp();
  doc["sensor_id"] = sensorId;
  
  // Add sensor values
  JsonObject values = doc.createNestedObject("values");
  values["aq2"] = aq2;
  values["temperature"] = temperature;
  values["humidity"] = humidity;
  
  JsonObject gps = values.createNestedObject("gps");
  gps["latitude"] = latitude;
  gps["longitude"] = longitude;
  gps["altitude"] = altitude;
  
  // Add location
  JsonObject location = doc.createNestedObject("location");
  location["latitude"] = latitude;
  location["longitude"] = longitude;
  location["altitude"] = altitude;
  
  // Serialize JSON to string
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  Serial.println("\n┌─── Sending Data ───────────────────────");
  Serial.print("│ Payload: ");
  Serial.println(jsonPayload);
  
  // Send HTTP POST request
  HTTPClient http;
  http.begin(wifiClient, serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000); // 10 second timeout
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("│ Status: ");
    Serial.print(httpResponseCode);
    Serial.print(" ");
    
    if (httpResponseCode == 200) {
      Serial.println("✓ SUCCESS");
    } else {
      Serial.println("⚠ WARNING");
    }
    
    Serial.print("│ Response: ");
    Serial.println(response);
  } else {
    Serial.print("│ Status: ✗ ERROR (");
    Serial.print(httpResponseCode);
    Serial.println(")");
    Serial.print("│ Error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
  Serial.println("└────────────────────────────────────────\n");
}

// ============================================
// SENSOR READING FUNCTIONS
// Replace these with your actual sensor code
// ============================================

float readAQ2Sensor() {
  // Replace with actual AQ2/AQI sensor reading
  // Examples: MQ135 (air quality), GP2Y1010AU0F (dust sensor)
  
  // Simulated value for testing (50-200 AQI range)
  return random(50, 200) + random(0, 100) / 100.0;
}

float readTemperature() {
  // Replace with actual temperature sensor reading
  // Examples: DHT11, DHT22, DS18B20, BMP280
  
  // Simulated value for testing (20-35°C range)
  return 25.0 + random(-5, 10) + random(0, 100) / 100.0;
}

float readHumidity() {
  // Replace with actual humidity sensor reading
  // Examples: DHT11, DHT22, BME280
  
  // Simulated value for testing (40-70% range)
  return 50.0 + random(-10, 20) + random(0, 100) / 100.0;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

String getCurrentTimestamp() {
  time_t now = time(nullptr);
  
  // Check if time is synchronized
  if (now < 1000000000) {
    // Time not synced, use millis-based timestamp
    unsigned long epochTime = millis() / 1000;
    char timestamp[30];
    sprintf(timestamp, "2025-10-30T%02d:%02d:%02dZ", 
            (int)((epochTime / 3600) % 24),
            (int)((epochTime / 60) % 60),
            (int)(epochTime % 60));
    return String(timestamp);
  }
  
  // Use actual NTP time
  struct tm* timeinfo = gmtime(&now);
  
  char timestamp[30];
  strftime(timestamp, sizeof(timestamp), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  
  return String(timestamp);
}

