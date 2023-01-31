import math

def cosInDegrees(x):
    return math.cos(math.radians(x))

print(eval("cos(90)", {"cos": cosInDegrees}))