#ifndef FANSPEEDCONTROL_H
#define FANSPEEDCONTROL_H

#include <Arduino.h>

class FanSpeedControl {
public:
    FanSpeedControl(int pin);  // Constructor
    void begin();              // Setup function
    void setSpeed(int speed);  // Set fan speed (0-100%)
    
private:
    int fanPin;
    static const int freq = 25000;
    static const int resolution = 8;
};

#endif
