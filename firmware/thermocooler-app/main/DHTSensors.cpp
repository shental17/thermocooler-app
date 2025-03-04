#include "DHT.h"
#include "DHTSensors.h"

#define DHT_PIN1 5
#define DHT_PIN2 18
#define DHT_TYPE DHT22

DHT dhtSensor1(DHT_PIN1, DHT_TYPE);
DHT dhtSensor2(DHT_PIN2, DHT_TYPE);

float humidity1, tempC1, heatIndexC1, humidity2, tempC2, heatIndexC2;

void setupDHTSensors() {
    dhtSensor1.begin();
    dhtSensor2.begin();
}

void loopDHTSensors() {
    humidity1 = dhtSensor1.readHumidity();
    tempC1 = dhtSensor1.readTemperature();
    heatIndexC1 = dhtSensor1.computeHeatIndex(tempC1, humidity1, false);

    humidity2 = dhtSensor2.readHumidity();
    tempC2 = dhtSensor2.readTemperature();
    heatIndexC2 = dhtSensor2.computeHeatIndex(tempC2, humidity2, false);

    if (isnan(humidity1) || isnan(tempC1)) {
        humidity1 = -1.0;
        tempC1 = -1.0;
        heatIndexC1 = -1.0;
    }

    if (isnan(humidity2) || isnan(tempC2)) {
        Serial.println("Failed to read from DHT Sensor 2!");
        humidity2 = -1.0;
        tempC2 = -1.0;
        heatIndexC2 = -1.0;
    }
}
