#include "TimeUtils.h"
#include "time.h"

// Function to get the current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    // Serial.println("Failed to obtain time");
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

// Function to get the formatted date and time (YYYY-MM-DD HH:MM:SS)
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
