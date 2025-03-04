#include <WiFi.h>
#include "Config.h"

void connectWiFi() {
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print(F("Connecting to Wi-Fi"));
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(F("."));
    delay(1000);
  }
  Serial.println();
  Serial.print(F("Connected with IP: "));
  Serial.println(WiFi.localIP());
}