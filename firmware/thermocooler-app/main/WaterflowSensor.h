#ifndef WATERFLOWSENSOR_H
#define WATERFLOWSENSOR_H

extern float flowRate;
extern unsigned long totalMilliLitres;

void setupWaterFlowSensor();
void loopWaterFlowSensor();

#endif