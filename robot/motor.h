#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>



class Motor 
{
  private:
    int speed_pin;
    int direction_pin1;
    int direction_pin2;

  public:
    Motor(int s_pin, int d_pin1, int d_pin2) {
      speed_pin = s_pin;
      direction_pin1 = d_pin1;
      direction_pin2 = d_pin2;

      pinMode(speed_pin, OUTPUT);
      pinMode(direction_pin1, OUTPUT);
      pinMode(direction_pin2, OUTPUT);
    }

    void initialise() {
      digitalWrite(direction_pin1, LOW);
      digitalWrite(direction_pin2, LOW);
      analogWrite(speed_pin, 255);
    }

    void goForward() {
      digitalWrite(direction_pin1, HIGH);
      digitalWrite(direction_pin2, LOW);
    }

    void goBack() {
      digitalWrite(direction_pin1, LOW);
      digitalWrite(direction_pin2, HIGH);
    }

    void Brake() {
      digitalWrite(direction_pin1, HIGH);
      digitalWrite(direction_pin2, HIGH);
    }

    void setSpeed(int speed)
    {
      analogWrite(speed_pin , speed);
    }
};


