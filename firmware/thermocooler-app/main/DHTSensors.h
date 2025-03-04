#ifndef DHTSENSORS_H
#define DHTSENSORS_H

extern float humidity1, tempC1, heatIndexC1, humidity2, tempC2, heatIndexC2;

void setupDHTSensors();
void loopDHTSensors();

#endif
