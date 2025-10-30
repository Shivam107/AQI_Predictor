#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Animesh";
const char* password = "12345678";
const String serverUrl = "http://your-backend-url.com/api/aqi";  // <-- Replace with your Express endpoint

WiFiClient client;
String incomingData = "";

void setup() {
  Serial.begin(115200);
  Serial.println("\n===============================");
  Serial.println("   ESP8266 DATA RELAY SYSTEM");
  Serial.println("===============================");
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected ✅");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("===============================");
}

void loop() {
  if (Serial.available()) {
    incomingData = Serial.readStringUntil('\n');
    incomingData.trim();

    if (incomingData.length() > 0) {
      Serial.println("\n📡 Received JSON from Arduino:");
      Serial.println(incomingData);

      if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(client, serverUrl);
        http.addHeader("Content-Type", "application/json");

        int httpCode = http.POST(incomingData);
        String payload = http.getString();

        Serial.println("----------------------------------");
        Serial.print("🌍 POST Status: ");
        Serial.println(httpCode);
        Serial.print("🛰️ Server Response: ");
        Serial.println(payload);
        Serial.println("----------------------------------");

        http.end();
      } else {
        Serial.println("⚠️ WiFi not connected. Retrying...");
        WiFi.begin(ssid, password);
      }
    }
  }

  delay(3000);
}
