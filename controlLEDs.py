#!/usr/bin/python3

import sys
import time
import RPi.GPIO as GPIO
GPIO.setwarnings(False)

n = len(sys.argv)

led_blue = 33  # Blue
led_green = 35  # Green
led_red = 31  # Red

GPIO.setmode(GPIO.BOARD)
GPIO.setup(led_blue, GPIO.OUT)
GPIO.setup(led_green, GPIO.OUT)
GPIO.setup(led_red, GPIO.OUT)

def Color(r, g, b):
    GPIO.output(led_red, BooleanToGPIO(r))
    GPIO.output(led_green, BooleanToGPIO(g))
    GPIO.output(led_blue, BooleanToGPIO(b))

def BooleanToGPIO(value):
    if value == 1:
        return GPIO.LOW
    else:
        return GPIO.HIGH

r = int(sys.argv[1])
g = int(sys.argv[2])
b = int(sys.argv[3])

Color(r, g, b)
print (f"({sys.argv[1]}, {sys.argv[2]}, {sys.argv[3]})")