#include <Arduino.h>
// #include <AsyncTCP.h>
// #include <ESPAsyncWebServer.h>
#include <ESP_Google_Sheet_Client.h>
#include <GS_SDHelper.h>
#include "Config.h"
#include "WiFiManager.h"
#include "WaterflowSensor.h"
#include "TemperatureSensors.h"
#include "FanSpeedControl.h"
#include "DHTSensor.h"
#include "time.h"

// // Create AsyncWebServer object on port 80
// AsyncWebServer server(80);
// AsyncWebSocket ws("/ws");

// Timer variables
unsigned long lastTime = 0;  
unsigned long timerDelay = 30000;

// Token Callback function
void tokenStatusCallback(TokenInfo info);

// NTP server to request epoch time
const char* ntpServer = "pool.ntp.org";

// Variable to save current epoch time
unsigned long epochTime; 

#define DHTPIN1 5  // Pin for first DHT sensor
// #define DHTPIN2 5  // Pin for second DHT sensor
#define DHTTYPE DHT22  // DHT sensor type

DHTSensor dhtSensor1(DHTPIN1, DHTTYPE);

void setup() {
  Serial.begin(9600);
  //Configure time to Singapore Time (UTC +8)
  configTime(8 * 3600, 0, ntpServer);
  GSheet.printf("ESP Google Sheet Client v%s\n\n", ESP_GOOGLE_SHEET_CLIENT_VERSION);

  // Connect to Wi-Fi
  connectWiFi();

  // Set the callback for Google API access token generation status (for debug only)
  GSheet.setTokenCallback(tokenStatusCallback);

  // Set the seconds to refresh the auth token before expire (60 to 3540, default is 300 seconds)
  GSheet.setPrerefreshSeconds(10 * 60);

  // Begin the access token generation for Google API authentication
  GSheet.begin(CLIENT_EMAIL, PROJECT_ID, PRIVATE_KEY);

  setupWaterFlowSensor();
  setupTemperatureSensors();
  setupFanSpeedControl();
  dhtSensor1.begin();
}

void loop() {
  // Call ready() repeatedly in loop for authentication checking and processing
  bool ready = GSheet.ready();
  if (ready && millis() - lastTime > timerDelay){
        

        lastTime = millis();

        FirebaseJson response;

        Serial.println("\nAppend spreadsheet values...");
        Serial.println("----------------------------");

        FirebaseJson valueRange;

        // Set Fan Speed
        setFanSpeed();
        // Get temperature sensor readings
        loopTemperatureSensors();
        // Get waterflow sensor readings
        loopWaterFlowSensor();
        // Get humidity sensor readings
        // Read values from first sensor
        float humidity1 = dhtSensor1.getHumidity();
        float tempC1 = dhtSensor1.getTemperature();
        float heatIndexC1 = dhtSensor1.getHeatIndex();

        // Get timestamp
        epochTime = getTime();

        // Get the current date as a sheet name
        String sheetName = getCurrentDate();

        // Convert epoch time to a readable format
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
        // valueRange.set("values/[7]/[0]", fanSpeedPercentage);

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

// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}

// Function to get the current date as a string (YYYY-MM-DD)
String getCurrentDate() {
    struct tm timeinfo;
    char formattedDate[15];  // Buffer for formatted date

    if (getLocalTime(&timeinfo)) {
        strftime(formattedDate, sizeof(formattedDate), "%Y-%m-%d", &timeinfo);
        return String(formattedDate);  // Convert to String format
    }
    return "Unknown_Date";  // Fallback if time fetch fails
}

String getFormattedDateTime() {
    struct tm timeinfo;
    char formattedDateTime[30];  // Buffer to hold formatted date

    if (getLocalTime(&timeinfo)) {
        strftime(formattedDateTime, sizeof(formattedDateTime), "%Y-%m-%d %H:%M:%S", &timeinfo);
        return String(formattedDateTime);  // Return formatted date as String
    } else {
        return "Unknown Time";  // Return fallback message if time retrieval fails
    }
}

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
    const char* headers[] = {
        "Timestamp", 
        "Temp Sensor 1 (°C)", 
        "Temp Sensor 2 (°C)", 
        "Temp Sensor 3 (°C)", 
        "Temp Sensor 4 (°C)", 
        "Flow Rate (L/min)", 
        "Total Volume (mL)", 
        "Humidity Sensor 1 Humidity",
        "Humidity Sensor 1 Temperature (°C)",
        "Humidity Sensor 1 Heat Index (°C)",
        "Fan 1 Speed Percentage", 
        "Fan 2 Speed Percentage"
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