# 📟 ESP8266 Sensor Code Setup Guide

This Arduino code sends sensor data to your backend **every 3 seconds**.

## 📋 Quick Setup

### 1. Required Hardware
- ESP8266 board (NodeMCU, Wemos D1 Mini, etc.)
- USB cable for programming
- Sensors (optional, code works with simulated data)

### 2. Install Arduino IDE Setup

1. **Install ESP8266 Board Support:**
   - Open Arduino IDE
   - Go to: File → Preferences
   - Add to "Additional Board Manager URLs":
     ```
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Go to: Tools → Board → Boards Manager
   - Search for "esp8266" and install

2. **Install Required Libraries:**
   - Go to: Sketch → Include Library → Manage Libraries
   - Install: **ArduinoJson** (by Benoit Blanchon)

### 3. Configure the Code

Open `ESP8266_Sensor_Code.ino` and update these lines:

```cpp
// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi name
const char* password = "YOUR_WIFI_PASSWORD";   // Your WiFi password

// Backend API endpoint
const char* serverUrl = "https://your-backend.onrender.com/api/sensor-data";  // Your Render URL

// Sensor ID (unique for each device)
const char* sensorId = "esp8266-001";  // Change for each device
```

### 4. Upload to ESP8266

1. Connect ESP8266 to computer via USB
2. Select: Tools → Board → ESP8266 Boards → (your board)
3. Select: Tools → Port → (your COM port)
4. Click **Upload** button
5. Wait for "Done uploading"

### 5. Monitor Serial Output

1. Click **Serial Monitor** button (top right)
2. Set baud rate to **115200**
3. You should see:
   ```
   ========================================
   ESP8266 Sensor Data Logger
   Send Interval: 3 seconds
   ========================================
   Connecting to WiFi: YourNetwork
   ...
   ✓ WiFi Connected!
   IP Address: 192.168.1.100
   Syncing time with NTP server... Done!
   
   ┌─── Sending Data ───────────────────────
   │ Payload: {"timestamp":"2025-10-30T10:15:30Z",...}
   │ Status: 200 ✓ SUCCESS
   │ Response: {"status":"received",...}
   └────────────────────────────────────────
   ```

---

## ⚙️ Configuration Options

### Change Send Interval

The default is **3 seconds**. To change it:

```cpp
const unsigned long sendInterval = 3000;  // milliseconds
```

Examples:
- 1 second: `1000`
- 5 seconds: `5000`
- 10 seconds: `10000`
- 1 minute: `60000`

### Change Timezone

Default is IST (India Standard Time). To change:

```cpp
const long gmtOffset_sec = 0;     // UTC
// OR
const long gmtOffset_sec = -18000;  // EST (UTC-5)
// OR
const long gmtOffset_sec = -28800;  // PST (UTC-8)
```

---

## 🔌 Adding Real Sensors

### DHT22 Temperature & Humidity Sensor

1. **Install DHT library:**
   - Sketch → Include Library → Manage Libraries
   - Install: **DHT sensor library** (by Adafruit)

2. **Add to top of code:**
   ```cpp
   #include <DHT.h>
   #define DHTPIN D4     // Pin connected to DHT22
   #define DHTTYPE DHT22
   DHT dht(DHTPIN, DHTTYPE);
   ```

3. **In setup():**
   ```cpp
   dht.begin();
   ```

4. **Replace functions:**
   ```cpp
   float readTemperature() {
     return dht.readTemperature();
   }
   
   float readHumidity() {
     return dht.readHumidity();
   }
   ```

### MQ135 Air Quality Sensor

```cpp
#define MQ135_PIN A0  // Analog pin

float readAQ2Sensor() {
  int rawValue = analogRead(MQ135_PIN);
  // Convert to AQI (adjust formula based on your sensor)
  float aqi = map(rawValue, 0, 1023, 0, 500);
  return aqi;
}
```

### GPS Module (NEO-6M)

1. **Install TinyGPS++ library:**
   - Sketch → Include Library → Manage Libraries
   - Install: **TinyGPSPlus** (by Mikal Hart)

2. **Add GPS code** (see separate GPS example if needed)

---

## 🐛 Troubleshooting

### WiFi Connection Failed
- Check WiFi credentials (SSID and password)
- Ensure WiFi is 2.4GHz (ESP8266 doesn't support 5GHz)
- Move closer to router

### Upload Failed
- Check correct board selected
- Check correct COM port selected
- Try different USB cable
- Press FLASH/BOOT button during upload (some boards)

### HTTP Error
- Check backend URL is correct
- Ensure backend is deployed and running
- Test backend URL in browser: `https://your-backend.onrender.com/`
- Check firewall isn't blocking

### Time Sync Failed
- Check internet connection
- NTP server might be blocked
- Code will still work with approximate timestamps

---

## 📊 Expected Data Format

The ESP8266 sends data in this format:

```json
{
  "timestamp": "2025-10-30T10:15:30Z",
  "sensor_id": "esp8266-001",
  "values": {
    "aq2": 123.45,
    "temperature": 27.5,
    "humidity": 62.1,
    "gps": {
      "latitude": 19.076,
      "longitude": 72.8777,
      "altitude": 14.2
    }
  },
  "location": {
    "latitude": 19.076,
    "longitude": 72.8777,
    "altitude": 14.2
  }
}
```

---

## 📈 Performance

- **Send Interval:** 3 seconds
- **Data per minute:** 20 readings
- **Data per hour:** 1,200 readings
- **Data per day:** 28,800 readings

⚠️ **Warning:** Sending data every 3 seconds generates a lot of traffic. Consider:
- Increasing interval for production (e.g., 30-60 seconds)
- Using HTTPS to secure data transmission
- Monitoring your data usage

---

## 🔐 Security Notes

Current configuration:
```cpp
wifiClient.setInsecure(); // Disables SSL verification
```

For production:
1. Use proper SSL certificate verification
2. Consider using API keys for authentication
3. Encrypt sensitive data

---

## 📝 Quick Reference

| Item | Value |
|------|-------|
| **Baud Rate** | 115200 |
| **Send Interval** | 3 seconds (3000ms) |
| **Backend Endpoint** | `/api/sensor-data` |
| **HTTP Method** | POST |
| **Content-Type** | application/json |
| **Timezone** | IST (UTC+5:30) |

---

## 🆘 Need Help?

1. Check Serial Monitor for error messages
2. Test backend URL in browser
3. Verify WiFi credentials
4. Check sensor connections
5. Try simpler code first (just WiFi connection)

Good luck! 🚀

