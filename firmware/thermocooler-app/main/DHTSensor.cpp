#include "DHTSensor.h"
#include "Arduino.h"

DHTSensor::DHTSensor(uint8_t pin, uint8_t type) : dht(pin, type) {}

void DHTSensor::begin() {
    dht.begin();
    Serial.println("Humidity Sensor Set Up.");
}

float DHTSensor::getHumidity() {
    float h = dht.readHumidity();
    return isnan(h) ? -1.0 : h;
}

float DHTSensor::getTemperature(bool isFahrenheit) {
    float t = dht.readTemperature(isFahrenheit);
    return isnan(t) ? -1.0 : t;
}

float DHTSensor::getHeatIndex(bool isFahrenheit) {
    float t = dht.readTemperature(isFahrenheit);
    float h = dht.readHumidity();
    
    if (isnan(t) || isnan(h)) {
        return -1.0;
    }
    
    return dht.computeHeatIndex(t, h, isFahrenheit);
}
