#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP_Google_Sheet_Client.h>
#include <GS_SDHelper.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include "Config.h"
#include "WiFiManager.h"
#include "TimeUtils.h"
#include "WaterflowSensor.h"
#include "TemperatureSensors.h"
#include "FanSpeedControl.h"
#include "DHTSensors.h"
#include "time.h"

SocketIOclient socketIO;

// JSONVar readings; // Json Variable to Hold Sensor Readings

// Timer variables
unsigned long lastTime = 0;  
unsigned long timerDelay = 20000;

// Token Callback function
void tokenStatusCallback(TokenInfo info);

// NTP server to request epoch time
const char* ntpServer = "pool.ntp.org";

// Variable to save current epoch time
unsigned long epochTime; 

#define RELAY_PIN 16 //RELAY PIN for TEC Chips
#define FANPIN1 14  // Pin for first FAN
#define PUMPPIN1 15  // Pin for first PUMP sensor

FanSpeedControl fan(FANPIN1);  // Fan on pin 14
FanSpeedControl pump(PUMPPIN1); // Pump on pin 15

volatile int fanSpeedPercentage = 10;
volatile int pumpSpeedPercentage = 100;
volatile int setTemperature = 25;



void createNewSheetIfNotExists(String sheetName) {
    FirebaseJson response; // Create a FirebaseJson object for the response
    FirebaseJsonArray requestArray;

    // Prepare request payload to create a new sheet
    FirebaseJson request;
    request.set("addSheet/properties/title", sheetName);
    requestArray.add(request); // Add request object to array

    // Send batchUpdate request to create the new sheet
    bool success = GSheet.batchUpdate(&response, spreadsheetId, &requestArray); // Pass the response object

    if (success) {
        Serial.println("New sheet created: " + sheetName);
        addHeadersIfNeeded(sheetName); // Call to add headers after creating the sheet
    } else {
        Serial.println("Failed to create sheet: " + GSheet.errorReason());
    }
}

void addHeadersIfNeeded(String sheetName) {
    FirebaseJson response;
    
    // Define the header row
    FirebaseJson headerRange;
    // Define headers in an array
    const char* headers[] PROGMEM= {
        "Timestamp", 
        "Ambient Water Temp Sensor 1 (°C)", 
        "Water Before Cooling Tower Temp Sensor 2 (°C)", 
        "Water After Cooling Tower Temp Sensor 3 (°C)", 
        "Cold Fin Temp Sensor 4 (°C)", 
        "Flow Rate (L/min)", 
        "Total Volume"
        "Ambient Humidity Sensor 1 Humidity",
        "Ambient Humidity Sensor 1 Temperature (°C)",
        "Ambient Humidity Sensor 1 Heat Index (°C)",
        "Outlet Fan Air Humidity Sensor 2 Humidity",
        "Outlet Fan Air Humidity Sensor 2 Temperature (°C)",
        "Outlet Fan Air Humidity Sensor 2 Heat Index (°C)",
        "Outlet Fan Speed Percentage", 
        "Top Water Pump Speed Percentage"
    };

    // Set major dimension and headers
    headerRange.add("majorDimension", "COLUMNS");

    for (int i = 0; i < sizeof(headers) / sizeof(headers[0]); i++) {
        headerRange.set("values/[" + String(i) + "]/[0]", headers[i]);
    }

    // Try writing headers to the first row
    bool success = GSheet.values.append(&response, spreadsheetId, "'" + sheetName + "'!A1", &headerRange);
    
    if (success) {
        Serial.println("Headers added successfully!");
    } else {
        Serial.println("Failed to add headers: " + GSheet.errorReason());
    }
}


void tokenStatusCallback(TokenInfo info){
    if (info.status == token_status_error){
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
        GSheet.printf("Token error: %s\n", GSheet.getTokenError(info).c_str());
    }
    else{
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
    }
}

String getSensorReadings() {
  StaticJsonDocument<256> doc;  // Allocate memory for JSON object (adjust size as needed)

  doc["ambientTemperature"] = temp1;
  doc["sensor1"] = temp1;
  doc["sensor2"] = temp2;
  doc["sensor3"] = temp3;
  doc["sensor4"] = temp4;
  doc["humiditySensor1"] = tempC1;
  doc["humiditySensor2"] = tempC2;

  String jsonString;
  serializeJson(doc, jsonString);  // Convert JSON object to a string

  return jsonString;  // Return the JSON string
}


void changePowerState(boolean powerState){
  if (powerState) {
      digitalWrite(RELAY_PIN, HIGH);
  } else {
      digitalWrite(RELAY_PIN, LOW);
  }
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            Serial.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            Serial.printf("[IOc] Connected to url: %s\n", payload);
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
        {
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if(error) {
                Serial.print("deserializeJson() failed: ");
                Serial.println(error.c_str());
                return;
            }

            String eventName = String(doc[0]); // Event name is the first part of the payload
            Serial.printf("[IOc] Event name: %s\n", eventName.c_str());
            if(eventName == "getThermocooler") {
                bool powerState = doc[1]["powerState"];  // Get power state
                int newSetTemperature = doc[1]["setTemperature"];  // Correctly get set temperature
                int newFanSpeedPercentage = doc[1]["fanSpeed"];  // Correctly get fan speed
                fanSpeedPercentage = newFanSpeedPercentage;
                setTemperature = newSetTemperature;
                Serial.printf("[IOc] Power state: %d\n", powerState);
                Serial.printf("[IOc] New Set Temperature: %d\n", newSetTemperature);
                Serial.printf("[IOc] New Fan Speed Percentage: %d\n", fanSpeedPercentage);
                changePowerState(powerState);
                fan.setSpeed(fanSpeedPercentage); 
            }
            // Handle updatePowerState event
            if(eventName == "updatePowerState") {
                bool powerState = doc[1]["powerState"];
                Serial.printf("[IOc] Power state: %d\n", powerState);
                changePowerState(powerState);
            }
            // Handle updateFanSpeed event
            if(eventName == "updateFanSpeed") {
                int newFanSpeedPercentage = doc[1]["fanSpeed"].as<int>();  // Correct JSON indexing
                Serial.printf("[IOc] New Fan Speed Percentage: %d\n", newFanSpeedPercentage);
                fanSpeedPercentage = newFanSpeedPercentage;
                Serial.printf("[IOc] Updated Fan Speed Percentage: %d\n", fanSpeedPercentage);
                fan.setSpeed(fanSpeedPercentage); // Corrected variable name
            }

        }
            break;
        case sIOtype_ACK:
            Serial.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            Serial.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            Serial.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            Serial.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}

void setup() {
  Serial.begin(9600);
  Serial.setDebugOutput(true);
  //Configure time to Singapore Time (UTC +8)
  configTime(0, 0, ntpServer);
  setenv("TZ", "SGT-8", 1);
  tzset();

  GSheet.printf("ESP Google Sheet Client v%s\n\n", ESP_GOOGLE_SHEET_CLIENT_VERSION);

  // Connect to Wi-Fi
  connectWiFi();

  // Set the callback for Google API access token generation status (for debug only)
  GSheet.setTokenCallback(tokenStatusCallback);

  // Set the seconds to refresh the auth token before expire (60 to 3540, default is 300 seconds)
  GSheet.setPrerefreshSeconds(10 * 60);

  // Begin the access token generation for Google API authentication
  GSheet.begin(CLIENT_EMAIL, PROJECT_ID, PRIVATE_KEY);

  socketIO.begin(SERVER_IP_ADDRESS, PORT,  "/socket.io/?EIO=4");
  socketIO.onEvent(socketIOEvent);

  pinMode(RELAY_PIN, OUTPUT);
  setupWaterFlowSensor();
  setupTemperatureSensors();
  setupDHTSensors();
  fan.begin();
  pump.begin();
}

void loop() {
  socketIO.loop();
  // Call ready() repeatedly in loop for authentication checking and processing
  bool ready = GSheet.ready();
  if (ready && millis() - lastTime > timerDelay){

        lastTime = millis();

        FirebaseJson response;

        Serial.println("\nAppend spreadsheet values...");
        Serial.println("----------------------------");

        FirebaseJson valueRange;

        digitalWrite(RELAY_PIN, HIGH); // On TEC Chips

        // Set PWM
        fan.setSpeed(fanSpeedPercentage); 
        pump.setSpeed(pumpSpeedPercentage);

        loopTemperatureSensors(); // Get temperature sensor readings
        loopWaterFlowSensor();  // Get waterflow sensor readings
        loopDHTSensors();  // Get humidity sensor readings

        String sensorReadings = getSensorReadings();
        // Send the sensor data to the server
        String message = "[\"sensorReadings\", " + sensorReadings + "]";
        socketIO.sendEVENT(message);

        // Get timestamp
        epochTime = getTime();

        // // Get the current date as a sheet name
        String sheetName = getCurrentDate();

        // // Convert epoch time to a readable format
        String formattedDateTime = getFormattedDateTime();

        //Create a new google sheet for the current date and create headers for new google sheet
        createNewSheetIfNotExists(sheetName);

        valueRange.add("majorDimension", "COLUMNS");
        valueRange.set("values/[0]/[0]", formattedDateTime);
        valueRange.set("values/[1]/[0]", temp1);
        valueRange.set("values/[2]/[0]", temp2);
        valueRange.set("values/[3]/[0]", temp3);
        valueRange.set("values/[4]/[0]", temp4);
        valueRange.set("values/[5]/[0]", flowRate);
        valueRange.set("values/[6]/[0]", totalMilliLitres);
        valueRange.set("values/[7]/[0]", humidity1);
        valueRange.set("values/[8]/[0]", tempC1);
        valueRange.set("values/[9]/[0]", heatIndexC1);
        valueRange.set("values/[10]/[0]", humidity2);
        valueRange.set("values/[11]/[0]", tempC2);
        valueRange.set("values/[12]/[0]", heatIndexC2);
        valueRange.set("values/[13]/[0]", fanSpeedPercentage);
        valueRange.set("values/[14]/[0]", pumpSpeedPercentage);

        // For Google Sheet API ref doc, go to https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
        // Append values to the correct sheet (date as sheet name)
        bool success = GSheet.values.append(&response/* returned response */, spreadsheetId /* spreadsheet Id to append */, sheetName + "!A1"/* range to append */, &valueRange /* data range to append */);
        
        if (success){
            response.toString(Serial, true);
            valueRange.clear();
        }
        else{
            Serial.println(GSheet.errorReason());
        }
        Serial.println();
        Serial.println(ESP.getFreeHeap());
    }
  
}




