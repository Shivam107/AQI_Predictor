<h1>Hardware →</h1>
        <ul>
          <li>Arduino Uno</li>
          <li>ESP8266 Wi-Fi Module</li>
          <li>MQ-2 Gas Sensor</li>
          <li>Temperature &amp; Humidity Sensor</li>
          <li>GPS Sensor (Longitude, Latitude, Altitude)</li>
        </ul>

<h2>Project Images</h2>
      <div class="gallery">
        <img src="https://github.com/user-attachments/assets/1173fd7b-17b1-4fbb-8746-23a75c9ee067" alt="Breadboard and wiring close-up 1">
        <img src="https://github.com/user-attachments/assets/9daabaae-8a2b-4d7e-8712-53c5b2a77db3" alt="Breadboard and wiring close-up 2">
        <img src="https://github.com/user-attachments/assets/9bd72591-2325-4817-b6c7-ea3cf5028077" alt="Breadboard and wiring close-up 3">
      </div>

<h2>System Description</h2>
      <div class="card">
        <p>
          The Arduino Uno collects data from an MQ-2 gas sensor, a temperature and humidity sensor, and a GPS module, then
          displays the readings on the serial monitor. It converts the readings to JSON and sends them to an ESP8266
          Wi-Fi module, which uploads the data to MongoDB / AtlasDB.
        </p>
        <div class="flow">Sensors → Arduino Uno → JSON → ESP8266 (Wi-Fi) → MongoDB / AtlasDB</div>
      </div>

<h2>Additional Images</h2>
      <div class="gallery">
        <img src="https://github.com/user-attachments/assets/94a84e35-f5b7-491d-bfbc-661a19e8f632" alt="Serial monitor or device display 1">
        <img src="https://github.com/user-attachments/assets/fc202f14-4fc0-4aa9-9f39-303b80abce8e" alt="Serial monitor or device display 2">
      </div>
