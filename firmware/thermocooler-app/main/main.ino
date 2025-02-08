#include <Arduino.h>
#include "Config.h"
#include "WiFiManager.h"
#include "WaterflowSensor.h"
#include "TemperatureSensors.h"
#include "time.h"
#include <ESP_Google_Sheet_Client.h>
#include <GS_SDHelper.h>

// Timer variables
unsigned long lastTime = 0;  
unsigned long timerDelay = 30000;

// Token Callback function
void tokenStatusCallback(TokenInfo info);

// NTP server to request epoch time
const char* ntpServer = "pool.ntp.org";

// Variable to save current epoch time
unsigned long epochTime; 

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
  // setupWaterFlowSensor();
  setupTemperatureSensors();
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

          // Get temperature sensor readings
        loopTemperatureSensors();
        // // Get waterflow sensor readings
        // loopWaterFlowSensor();

        // Get timestamp
        epochTime = getTime();

        // Get the current date as a sheet name
        String sheetName = getCurrentDate();

        // Convert epoch time to a readable format
        struct tm timeinfo;
        char formattedDateTime[30];  // Buffer to hold formatted date

        if (getLocalTime(&timeinfo)) {
            strftime(formattedDateTime, sizeof(formattedDateTime), "%Y-%m-%d %H:%M:%S", &timeinfo);
        } else {
            strcpy(formattedDateTime, "Unknown Time");  // Fallback in case of failure
        }

        //Create a new google sheet for the current date and create headers for new google sheet
        createNewSheetIfNotExists(sheetName);

        valueRange.add("majorDimension", "COLUMNS");
        valueRange.set("values/[0]/[0]", formattedDateTime);
        valueRange.set("values/[1]/[0]", temp1);
        valueRange.set("values/[2]/[0]", temp2);
        valueRange.set("values/[3]/[0]", temp3);
        valueRange.set("values/[4]/[0]", temp4);
        // valueRange.set("values/[5]/[0]", flowRate);
        // valueRange.set("values/[6]/[0]", totalMilliLitres);

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
    headerRange.add("majorDimension", "COLUMNS");
    headerRange.set("values/[0]/[0]", "Timestamp");
    headerRange.set("values/[1]/[0]", "Temp Sensor 1 (°C)");
    headerRange.set("values/[2]/[0]", "Temp Sensor 2 (°C)");
    headerRange.set("values/[3]/[0]", "Temp Sensor 3 (°C)");
    headerRange.set("values/[4]/[0]", "Temp Sensor 4 (°C)");
    headerRange.set("values/[5]/[0]", "Flow Rate (L/min)");
    headerRange.set("values/[6]/[0]", "Total Volume (mL)");

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