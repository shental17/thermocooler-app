#include <OneWire.h>
#include <DallasTemperature.h>
#include "TemperatureSensors.h"

#define ONE_WIRE_BUS 4
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

DeviceAddress sensor1 = { 0x28, 0x39, 0x4A, 0x8C, 0x3C, 0x19, 0x1, 0x9F };
DeviceAddress sensor2 = { 0x28, 0x5F, 0x8E, 0xCA, 0x44, 0x23, 0xB, 0x44 };
DeviceAddress sensor3 = { 0x28, 0x92, 0x91, 0xC9, 0x44, 0x23, 0xB, 0xA };
DeviceAddress sensor4 = { 0x28, 0x3C, 0x75, 0xC9, 0x44, 0x23, 0xB, 0x80 };

float temp1, temp2, temp3, temp4;

void setupTemperatureSensors() {
  sensors.begin();
}

void loopTemperatureSensors() {
  sensors.requestTemperatures();
  temp1 = sensors.getTempC(sensor1);
  temp2 = sensors.getTempC(sensor2);
  temp3 = sensors.getTempC(sensor3);
  temp4 = sensors.getTempC(sensor4);
}