#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#ifndef STASSID
#define STASSID "Rocky"
#define STAPSK "rockyPass"
#endif

const char *ssid = STASSID;
const char *password = STAPSK;

const char *host = "friday-server.now.sh";
const int httpsPort = 443;

const char fingerprint[] PROGMEM = "1B 91 76 FA 59 D1 C6 08 CC 14 8B CD 82 5E 88 FF 07 25 77 0E";
int relayGPIO = 2;
void setup()
{
    Serial.begin(115200);
    pinMode(relayGPIO, OUTPUT);
    Serial.println();
    Serial.print("connecting to ");
    Serial.println(ssid);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print("Connecting...");
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
        WiFiClientSecure client;
        client.setFingerprint(fingerprint);
        if (!client.connect(host, httpsPort))
        {
            Serial.println("connection failed");
            return;
        }

        String url = "/deviceStateFulfilment";
        client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                     "Host: " + host + "\r\n" +
                     "User-Agent: BuildFailureDetectorESP8266\r\n" +
                     "Connection: close\r\n\r\n");

        while (client.connected())
        {
            String line = client.readStringUntil('\n');
            if (line == "\r")
            {
                break;
            }
        }
        String line = client.readStringUntil('\n');
        if (line.startsWith("{\"state\":true"))
        {
            Serial.print("already turned ON \n");
            digitalWrite(relayGPIO, HIGH);
        }
        if (line.startsWith("{\"state\":false"))
            Serial.print("already turned OFF \n");
        digitalWrite(relayGPIO, LOW);

        )
    }
    delay(2500);
}
