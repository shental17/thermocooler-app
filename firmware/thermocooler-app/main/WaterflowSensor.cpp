#include <Arduino.h>
#include "WaterflowSensor.h"

#define LED_BUILTIN 2
#define SENSOR 27
#define CALIBRATION_FACTOR 4.5

long currentMillis = 0;
long previousMillis = 0;
int interval = 1000;
boolean ledState = LOW;
volatile byte pulseCount = 0;
byte pulse1Sec = 0;
float flowRate = 0.0;
unsigned int flowMilliLitres = 0;
unsigned long totalMilliLitres = 0;

void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setupWaterFlowSensor() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(SENSOR, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);
  digitalWrite(LED_BUILTIN, LOW);
}

void loopWaterFlowSensor() {
  currentMillis = millis();
  if (currentMillis - previousMillis > interval) {
    pulse1Sec = pulseCount;
    pulseCount = 0;
    flowRate = ((1000.0 / (currentMillis - previousMillis)) * pulse1Sec * 1000) / CALIBRATION_FACTOR;
    previousMillis = currentMillis;
    flowMilliLitres = flowRate / 60;
    totalMilliLitres += flowMilliLitres;

    if (flowRate > 0) {
      ledState = HIGH;
      digitalWrite(LED_BUILTIN, HIGH);
    } else {
      ledState = LOW;
      digitalWrite(LED_BUILTIN, LOW);
    }

    Serial.print("Flow rate: ");
    Serial.print(int(flowRate));
    Serial.print(" mL/min\t");
    Serial.print("Output Liquid Quantity: ");
    Serial.print(totalMilliLitres);
    Serial.print(" mL / ");
    Serial.print(totalMilliLitres / 1000);
    Serial.println(" L");
  }
}