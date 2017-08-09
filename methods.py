"""
An entire file for you to expand. Add methods here, and the client should be
able to call them with json-rpc without any editing to the pipeline.
"""
from nanpy import (Servo, ArduinoApi, SerialManager)
from time import sleep
from colourFunc import (colourWipe, rainbow, theaterChase)

from neopixel import *

# Setup Pins

LED_COUNT      = 3       # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
LED_STRIP      = ws.WS2811_STRIP_GRB   # Strip type and colour ordering

lightsPin = 7
ledState = False

servo = Servo(9)
servo.write(0)

tempPin = 6

try:
    connection = SerialManager()
    a = ArduinoApi(connection = connection)
    
    # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
    # Intialize the library (must be called once before other functions).
    strip.begin()

except:
    print("Failed to connect to Arduino")

# Some setup stuff    
a.pinMode(lightsPin, a.OUTPUT)
a.pinMode(tempPin, a.OUTPUT)

def toggle_led(on):
    if on:
        a.digitalWrite(lightsPin, a.HIGH)
    else:
        a.digitalWrite(lightsPin, a.LOW)
        
def move_servo(val):
	servo.write(val)

def change_temp(val):
	a.analogWrite(tempPin, val)

def toggle_neo(val):
    numList = val.split()
    colourWipe(strip, Color(int(numList[0]), int(numList[1]), int(numList[2])))

def toggle_disco_party(val):
    if val:
        theaterChase(strip, Color(127, 127, 127))  # White theater chase
	theaterChase(strip, Color(127,   0,   0))  # Red theater chase
	theaterChase(strip, Color(  0,   0, 127))  # Blue theater chase
	theaterChase(strip, Color(  0, 127, 127)) 
	theaterChase(strip, Color(127, 127,   0))
	theaterChase(strip, Color(127,   0, 127)) 

    else:
        colorWipe(strip, Color(0, 0, 0))



