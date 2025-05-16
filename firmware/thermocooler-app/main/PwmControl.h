#ifndef PWNCONTROL_H
#define PWNCONTROL_H

#include <Arduino.h>

class PwmControl {
public:
    PwmControl(int pin);  // Constructor
    void begin();              // Setup function
    void setSpeed(int speed);  // Set fan speed (0-100%)
    
private:
    int pwmPin;
    static const int freq = 25000;
    static const int resolution = 8;
};

#endif
