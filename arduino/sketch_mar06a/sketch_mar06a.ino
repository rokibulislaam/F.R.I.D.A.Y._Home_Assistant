#include <ArduinoJson.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <string>
int relayGPIO = 2;
const char *ssid = "Rocky";
const char *password = "rockyPass";

void setup()
{
    Serial.begin(115200);
    pinMode(relayGPIO, OUTPUT);
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting...");
    }
     
 Serial.println("");
 Serial.println("WiFi connected");
 Serial.println("IP address: ");
 Serial.println(WiFi.localIP());
}

void loop()
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin("http://friday-server.now.sh/deviceStateFulfilment");
//        "1B 91 76 FA 59 D1 C6 08 CC 14 8B CD 82 5E 88 FF 07 25 77 0E");
        int httpCode = http.GET();
        Serial.print("HTTP Code: ");
        Serial.print(httpCode);

        if (httpCode > 0)
        {
          const size_t capacity = JSON_OBJECT_SIZE(1) + 10;
            DynamicJsonDocument doc(capacity);

            const String json = http.getString();
Serial.println(json);
            deserializeJson(doc, json);

            bool state = doc["state"]; // true
            Serial.print("\n");

           if( state == ( 1 || true ) ) {
            Serial.print("alredy turned ON");
           }
           if(state == ( 0 || false)) {
            Serial.print("already turned OFF");
           }
            Serial.print(state);
            Serial.print("\n");
            if (state == (false || 0 ))
            {
                digitalWrite(relayGPIO, LOW);
            }
            delay(100);
        }
        http.end();
    }
    delay(3000);
}
