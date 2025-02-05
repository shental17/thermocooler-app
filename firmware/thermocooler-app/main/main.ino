#include <Arduino.h>
#include "WaterflowSensor.h"
#include "TemperatureSensors.h"
#include "time.h"
#include <ESP_Google_Sheet_Client.h>
#include <GS_SDHelper.h>

#define WIFI_SSID "Shontol"
#define WIFI_PASSWORD "ineedhelp"
// Google Project ID
#define PROJECT_ID "thermocooler-datalogging"
// Service Account's client email
#define CLIENT_EMAIL "thermocooler-datalogging@thermocooler-datalogging.iam.gserviceaccount.com"
// Service Account's private key
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDT92X7PMiXS0CH\nvdRo1TfN0d98r6HV+Cl+EX6UJtWKMp6zj5lh/RVXorIa3NMgFHOUDpvD7JeIYyBi\nCgQmOOCUCnOdXWQY0sA+9exIwEdruVI2W3uUEKS/IdTF2cNQzNbnCS8peGejhmgL\nIIFypZlt+HnSyk5rpvuG/T7U6gu5MifWs1FRJxTcxKCI3NF8zVGa5jNHmA3oXnW+\nXRrMR4Ht2ZqskwNh67aigz2yp/7VZQRVBDUE9DHpj6h016rN8vrOufpFQYjArcb1\nYHd3e0xZJgwHYQiVsksEfYLMdsTiO7vrb8NrKxFF8zyT8bgdBLGOwgsZZpmKpj0o\nUB7hdEXpAgMBAAECggEABJBIBs+5NeCt4/5HS3aDvA+vsxyI7HVqV0eDJSds44vR\ndOY7lCuBwSBEm2VzujYWgvKJkf9PB+WydcnnavdAho9vC81N8WbgMrrSuoJBR2V3\nCqqPj5GIKoFM9nGIzf2LBvBgrpDkElY7eTna75/3HLID1XD7nT+8HJzpNGZRmEwd\nFJN0iKOOl7lnOD5ZXpE/8EBVJs7xYDAyLTwgaA0eiwjHDpRft6gdWseZl5NNwfoq\njxFYWU372DRFOFDWcGvyj46pxGdW85JnnrgofmsrWhZoDu/aQM206LjWOlbsHf+e\nUDm+GVnvj2RXipZgTt1jb/D05tIFrSAPU5di0IoG8QKBgQD9UpLMRikUWyeUizbZ\nnL5m2FE7X1pyAg5tqiirzEQEeVqoDarMjUPYfMX6i85OEScAlWWs3Ea08f6BSWni\nIQC5D/cbXP9HRyOybrni7y2zY6sjOBjxVzFsTCugtaYUp6PX2+NpeHrUcicLG/sY\nBqcJxa76jYhe3iVFCJWTR7Bl1QKBgQDWNOz5JGBLv9himQgxZ3mwP4oCZ5aok3ng\nRGkdJGLQtE04C1M0d24ro0xYKn91YzCsQYquJENS10BWx6GJTxN2RMxtgBkBoHuH\n5Nqcxg0MqmlIuYamdMI8ziNDqtYMaRZ5Oc/I95StEvQey0Fk5Z2lXfVWnpHBodjh\nsJAytnXFxQKBgD7+TqTfeY2nUUNeDwi0MqDOf/y8rHgXTNE2dCCsjely5/lMVMHD\nCzEFbhHsvCOrnkBF5l/C8w5B8yDhSaRCwrRCZRd327800IqpgC4PfhTS3xbF92Xk\nYdTlaB/xq9gNC/A8rONoY1r6+/yGO71wwg7rCqUhltzIbwoopVFXjWT1AoGBAKvo\nxdYdL3sbeBmJH14m4S5lj+jmIa8gzEsEHCfbL8K3MNGtpRUSVESJRZfsY2ZeOI3F\n+/pN+Anf3i7HAAkmgUQFatrmVytLFFi3fgsblxV3Hg/TdRDZ25jZBswjqq1DGVoo\n32015QgRkgG0tcK31JEGmwLtN6TisyBNhyxr6pDRAoGBAKVjW9wOZXSp8r4IpFM5\nkLifwOYs5YFbkcpM4U1GjPuCwKOpphN0qy/ZdphcSxEkzPugnpejciwqAHs4WdnY\nQAQibOoafSRKU4lDIxnm0ytDAhL7SFcDUxSPsrXO8wDjgkZXdpqVH1A4WL350jhk\naMCntPP7oT2WL6EBJOr03zKy\n-----END PRIVATE KEY-----\n";
// The ID of the spreadsheet where you'll publish the data
const char spreadsheetId[] = "14JQdsmQZBLRAVksC1eRPhfUaqvE9ZvPd0U7fP0uj8Qg";

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
  //Configure time
  configTime(0, 0, ntpServer);
  GSheet.printf("ESP Google Sheet Client v%s\n\n", ESP_GOOGLE_SHEET_CLIENT_VERSION);

  // Connect to Wi-Fi
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // Set the callback for Google API access token generation status (for debug only)
  GSheet.setTokenCallback(tokenStatusCallback);

  // Set the seconds to refresh the auth token before expire (60 to 3540, default is 300 seconds)
  GSheet.setPrerefreshSeconds(10 * 60);

  // Begin the access token generation for Google API authentication
  GSheet.begin(CLIENT_EMAIL, PROJECT_ID, PRIVATE_KEY);
  setupWaterFlowSensor();
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
        // Get waterflow sensor readings
        loopWaterFlowSensor();

        // Get timestamp
        epochTime = getTime();

        valueRange.add("majorDimension", "COLUMNS");
        valueRange.set("values/[0]/[0]", epochTime);
        valueRange.set("values/[1]/[0]", temp1);
        valueRange.set("values/[2]/[0]", temp2);
        valueRange.set("values/[3]/[0]", temp3);
        valueRange.set("values/[4]/[0]", temp4);
        valueRange.set("values/[5]/[0]", flowRate);
        valueRange.set("values/[6]/[0]", totalMilliLitres);

        // For Google Sheet API ref doc, go to https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
        // Append values to the spreadsheet
        bool success = GSheet.values.append(&response /* returned response */, spreadsheetId /* spreadsheet Id to append */, "Sheet1!A1" /* range to append */, &valueRange /* data range to append */);
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

void tokenStatusCallback(TokenInfo info){
    if (info.status == token_status_error){
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
        GSheet.printf("Token error: %s\n", GSheet.getTokenError(info).c_str());
    }
    else{
        GSheet.printf("Token info: type = %s, status = %s\n", GSheet.getTokenType(info).c_str(), GSheet.getTokenStatus(info).c_str());
    }
}