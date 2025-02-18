#include "FanSpeedControl.h"

 int fanPin=14;  // GPIO pin for fan 1
// const int fanPin2 = 15;  // GPIO pin for fan 2
const int freq = 25000;
const int resolution = 8;

void setupFanSpeedControl() {
  Serial.println("Starting PWM Fan Speed Control...");

  // configure Fan PWM
  ledcAttach(fanPin, freq, resolution);

  Serial.println("PWM setup completed.");
}

void setFanSpeed() {
  // Serial.print("What speed would you like to set for the fan? (0-100%)");
  

  // while (Serial.available() == 0) {
  //   // Waiting for input
  // }

  // int fanSpeedPercentage = Serial.parseInt();
  int fanSpeedPercentage = 50;

  if (fanSpeedPercentage < 0) {
    fanSpeedPercentage = 0;  // Set to minimum if invalid input
  } else if (fanSpeedPercentage > 100) {
    fanSpeedPercentage = 100;  // Set to maximum if invalid input
  }
  
  int dutyCycle = map(fanSpeedPercentage, 0, 100, 0, 255);

  // Properly printing the value
  Serial.println("loopDutyCycle: ");
  Serial.println(dutyCycle);
  ledcWrite(fanPin, dutyCycle); // Set the PWM duty cycle
  Serial.print("Testing duty cycle: ");
  Serial.println(dutyCycle);
}

