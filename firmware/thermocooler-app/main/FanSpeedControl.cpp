#include "FanSpeedControl.h"

FanSpeedControl::FanSpeedControl(int pin) {
    fanPin = pin;
}

void FanSpeedControl::begin() {
    ledcAttach(fanPin, freq, resolution);
}

void FanSpeedControl::setSpeed(int speed) {
    if (speed < 0) speed = 0;
    if (speed > 100) speed = 100;
    
    int dutyCycle = map(speed, 0, 100, 0, 255);
    ledcWrite(fanPin, dutyCycle);
    
    // Serial.print("Setting fan on pin ");
    // Serial.print(fanPin);
    // Serial.print(" to speed ");
    // Serial.print(speed);
    // Serial.print("% (duty cycle: ");
    // Serial.print(dutyCycle);
    // Serial.println(")");
}
