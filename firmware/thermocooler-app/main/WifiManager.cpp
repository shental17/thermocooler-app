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

String getMacAddress() {
    uint8_t mac[6];
    WiFi.macAddress(mac);
    char macStr[18];
    sprintf(macStr, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    return String(macStr);
}