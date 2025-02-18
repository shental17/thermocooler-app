#ifndef DHTSENSOR_H
#define DHTSENSOR_H

#include "DHT.h"

class DHTSensor {
public:
    DHTSensor(uint8_t pin, uint8_t type);
    void begin();
    float getHumidity();
    float getTemperature(bool isFahrenheit = false);
    float getHeatIndex(bool isFahrenheit = false);

private:
    DHT dht;
};

#endif
