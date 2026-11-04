#include <WiFi.h>
#include "motor.h"

const char* ssid = "alvin10";
const char* password = "CLFE2DA436";

WiFiServer server(80);

// Static IP settings (Will ALWAYS be 192.168.1.150)
IPAddress local_IP(192, 168, 1, 150);   // ip 192.168.1.150
IPAddress gateway(192, 168, 1, 1);      
IPAddress subnet(255, 255, 255, 0);    
IPAddress primaryDNS(8, 8, 8, 8);      

int ena = 27; 
int in1 = 26; 
int in2 = 25; 
int enb = 13;
int in3 = 33;
int in4 = 32;

Motor right(ena, in1, in2);
Motor left(enb , in3 , in4);


void setup() {
  Serial.begin(115200);
  delay(1000);

  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  right.initialise();
  left.initialise();

  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting...");
  }
  
  Serial.println("");
  Serial.println("WiFi connected!");
  Serial.print("Your Webpage URL: http://");
  Serial.println(WiFi.localIP()); 
  
  server.begin();
}

void loop() 
{
  WiFiClient client = server.available(); 

  if (client) 
  {                             
    String currentLine = "";                
    while (client.connected()) 
    {            
      if (client.available()) 
      {             
        char c = client.read();             
        if (c == '\n') {                    
          if (currentLine.length() == 0) 
          {
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
        
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<style>");
            client.println("body { text-align: center; font-family: Arial; margin-top: 30px; background-color: #f4f4f9; }");
            client.println("button, input { font-size: 20px; padding: 15px; margin: 10px; border-radius: 8px; }");
            client.println(".fwd { background-color: #4CAF50; color: white; }");
            client.println(".back { background-color: #ff9800; color: white; }");
            client.println(".brake { background-color: #f44336; color: white; }");
            client.println("</style></head>");
            client.println("<body>");
            client.println("<h1>Hamilton</h1>");
      
            client.println("<p><a href=\"/FORWARD\"><button class=\"fwd\">FORWARD</button></a></p>");
            client.println("<p><a href=\"/BACK\"><button class=\"back\">BACK</button></a></p>");
            client.println("<p><a href=\"/BRAKE\"><button class=\"brake\">BRAKE</button></a></p>");

            // Speed input form
            client.println("<form action=\"/SETSPEED\" method=\"GET\">");
            client.println("<label>Speed (0-255): </label>");
            client.println("<input type=\"number\" name=\"val\" min=\"0\" max=\"255\" value=\"255\">");
            client.println("<button type=\"submit\">Set Speed</button>");
            client.println("</form>");
            
            client.println("</body></html>");
            client.println();
            break;
          } 
          else 
          {
            currentLine = "";
          }
        } 
        else if (c != '\r') 
        {
          currentLine += c;
        }

        if (currentLine.endsWith("GET /FORWARD")) 
        {
          right.goForward();
          left.goBack();
        }
        if (currentLine.endsWith("GET /BACK")) 
        {
          right.goBack();
          left.goForward();
        }
        if (currentLine.endsWith("GET /BRAKE")) 
        {
          right.Brake();
          left.Brake();
        }

        if (currentLine.indexOf("GET /SETSPEED?val=") != -1) {
          int valIndex = currentLine.indexOf("val=");
          if (valIndex != -1) 
          {
            int spaceIndex = currentLine.indexOf(" ", valIndex);
            String speedStr = currentLine.substring(valIndex + 4, spaceIndex);
            int speedVal = speedStr.toInt();
            right.setSpeed(speedVal);
            left.setSpeed(speedVal);
          }
        }

      }
    }
    client.stop();
  }
}