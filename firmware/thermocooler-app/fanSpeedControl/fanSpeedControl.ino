// the number of the FAN pin (PWM Pin)
const int fanPin = 14;  // 14 corresponds to GPIO14
// setting PWM properties
const int freq = 25000;
const int resolution = 8;

volatile unsigned int pulseCount = 0;

void IRAM_ATTR countPulses() {
  pulseCount++; // Increment the pulse count on each tachometer pulse
}
 
void setup(){
  // Start the serial communication for debugging
  Serial.begin(9600);
  delay(10000);
  Serial.println("Starting PWM Fan Speed Control...");

  // configure Fan PWM
  ledcAttach(fanPin, freq, resolution);

  Serial.println("PWM setup completed.");
  
  // if you want to attach a specific channel, use the following instead
  // ledcAttachChannel(ledPin, freq, resolution, 0);

}
 
void loop(){
  for (int dutyCycle : {0, 32, 64, 96, 128, 160, 192, 224, 255}) {
    ledcWrite(fanPin, dutyCycle); // Set the PWM duty cycle
    Serial.print("Testing duty cycle: ");
    Serial.println(dutyCycle);
    
    for (int i = 0; i < 3; i++) { // Wait for 1 minute, printing RPM every second
      printFanSpeed(dutyCycle);
      delay(5000);
    }
  }
}

// Function to calculate and print the fan speed (RPM)
void printFanSpeed(int dutyCycle) {
  noInterrupts(); // Disable interrupts to read pulseCount safely
  unsigned int pulses = pulseCount;
  pulseCount = 0; // Reset pulse count
  interrupts(); // Re-enable interrupts

  // Calculate RPM: RPM = (pulses * 60) / (fan poles * time in seconds)
  // Most fans have 2 pulses per revolution (fan poles = 2)
  unsigned long rpm = (pulses * 60) / 2; // Assuming a 1-second delay

  Serial.print("Duty Cycle: ");
  Serial.print(dutyCycle);
  Serial.print(" | RPM: ");
  Serial.println(rpm);
}