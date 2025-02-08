#include <WiFi.h>
#include "Config.h"

void connectWiFi() {
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  String deviceID = WiFi.macAddress();
  Serial.println("Device ID: " + deviceID);
  Serial.println();
}