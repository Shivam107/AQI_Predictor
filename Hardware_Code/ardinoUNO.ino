#include <SoftwareSerial.h>
#include <DHT.h>
#include <TinyGPSPlus.h>

#define DHTPIN 7
#define DHTTYPE DHT11
#define MQ2PIN A0
#define RX_GPS 4
#define TX_GPS 5
#define RX_ESP 2
#define TX_ESP 3

DHT dht(DHTPIN, DHTTYPE);
TinyGPSPlus gps;
SoftwareSerial gpsSerial(RX_GPS, TX_GPS);
SoftwareSerial espSerial(RX_ESP, TX_ESP);

void setup() {
  Serial.begin(9600);
  gpsSerial.begin(9600);
  espSerial.begin(115200);
  dht.begin();

  Serial.println("\n===============================");
  Serial.println("      AQI SYSTEM BOOTING");
  Serial.println("===============================");
  delay(2000);
}

void loop() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gasValue = analogRead(MQ2PIN);

  while (gpsSerial.available() > 0) gps.encode(gpsSerial.read());

  float latitude = gps.location.isValid() ? gps.location.lat() : 26.8434;
  float longitude = gps.location.isValid() ? gps.location.lng() : 75.5650;
  float altitude = gps.altitude.isValid() ? gps.altitude.meters() : 450.0;

  String jsonData = "{";
  jsonData += "\"temperature\":" + String(temp, 2) + ",";
  jsonData += "\"humidity\":" + String(humidity, 2) + ",";
  jsonData += "\"gas\":" + String(gasValue) + ",";
  jsonData += "\"latitude\":" + String(latitude, 6) + ",";
  jsonData += "\"longitude\":" + String(longitude, 6) + ",";
  jsonData += "\"altitude\":" + String(altitude, 2);
  jsonData += "}";

  Serial.println("\n----------------------------------");
  Serial.println("📡 SENSOR DATA TRANSMISSION LOG");
  Serial.println("----------------------------------");
  Serial.print("🌡️ Temperature: "); Serial.print(temp); Serial.println(" °C");
  Serial.print("💧 Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.print("🔥 Gas Value: "); Serial.println(gasValue);
  Serial.print("📍 Latitude: "); Serial.println(latitude, 6);
  Serial.print("📍 Longitude: "); Serial.println(longitude, 6);
  Serial.print("⛰️ Altitude: "); Serial.print(altitude, 2); Serial.println(" m");
  Serial.println("----------------------------------");
  Serial.println("Sending JSON → " + jsonData);
  Serial.println("----------------------------------");

  espSerial.println(jsonData);
  delay(3000);
}
