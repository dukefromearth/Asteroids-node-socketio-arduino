#include "Wire.h"
#include <MPU6050_light.h>
#include <ButtonDebounce.h>

MPU6050 mpu(Wire);
unsigned long timer = 0;
short sendDelay = 1000/120;
ButtonDebounce b1(6, 100);
ButtonDebounce b2(5, 100);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  mpu.begin();
  delay(1000);
  mpu.calcGyroOffsets();
  pinMode(6, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);
}

void loop() {
  b1.update();
  b2.update();
  mpu.update();
  if( (millis() - timer) > sendDelay ){ // print data every sendDelay ms
    String toSend = "";
    toSend =  toSend + 
              '[' + 
              mpu.getAngleX() + ',' + 
              mpu.getAngleY() + ',' + 
              mpu.getAngleZ() + ',' + 
              b1.state() + ',' + 
              b2.state() +
              ']';
    Serial.print(toSend);
	  timer = millis();  
  }
 
}
