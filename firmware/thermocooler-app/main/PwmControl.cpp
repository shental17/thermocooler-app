#include "PwmControl.h"

PwmControl::PwmControl(int pin) {
    pwmPin = pin;
}

void PwmControl::begin() {
    ledcAttach(pwmPin, freq, resolution);
}

void PwmControl::setSpeed(int speed) {
    if (speed < 0) speed = 0;
    if (speed > 100) speed = 100;
    
    int dutyCycle = map(speed, 0, 100, 0, 255);
    ledcWrite(pwmPin, dutyCycle);
}

