"""An original understated 18-second instrumental and paper-reveal sound design.
Uses Python's standard library only; no sampled music or reference-video audio.
Run from any directory: python campaign/source/score.py
"""
from array import array
from math import sin, pi, exp, tanh
from pathlib import Path
import random
import wave
import sys

RATE = 48000
PRICES = '--prices' in sys.argv
DURATION = 24 if PRICES else 18
random.seed(2026)
LIGHT_REVEAL = '--light-reveal' in sys.argv
events = []

def note(time, frequency, duration, gain, pan=0):
    events.append((time, frequency, duration, gain, pan))

# A spacious original F-minor / D-flat / A-flat / E-flat progression.
chords = [(174.614, 207.652, 261.626), (138.591, 174.614, 207.652),
          (207.652, 261.626, 311.127), (155.563, 195.998, 233.082)]
if PRICES:
    chords += [(138.591,174.614,207.652),(174.614,207.652,261.626)]
for idx, chord in enumerate(chords):
    for j, frequency in enumerate(chord):
        note(idx * 4.4, frequency / 2, 5.1, .045, (j - 1) * .35)
        note(idx * 4.4 + .18 * j, frequency * 2, 3.2, .035, (1 - j) * .45)

melody = [(2,622.254),(3.5,523.251),(5.8,415.305),(8.6,622.254),
          (10,523.251),(11.5,415.305),(12.3,523.251),(13.1,698.456),
          (16,523.251),(18.5,415.305),(21,523.251),(22,698.456)] if PRICES else [(3.4, 523.251), (4.7, 622.254), (6.0, 523.251),
                   (8.5, 415.305), (11.3, 622.254), (13.0, 523.251),
                   (14.2, 415.305), (15.0, 523.251), (15.75, 698.456)]
for time, freq in melody:
    note(time, freq, 2.5, .075, sin(time) * .45)

if LIGHT_REVEAL:
    for time, freq in [(1.46,1046.502),(1.52,1244.508),(1.59,1661.219)]:
        note(time,freq,1.5,.035,sin(time)*.35)

left = array('f', [0]) * (RATE * DURATION)
right = array('f', [0]) * (RATE * DURATION)
for start, freq, duration, gain, pan in events:
    for j in range(min(int(duration * RATE), len(left) - int(start * RATE))):
        t = j / RATE
        env = min(1, t / .08) * exp(-t / (duration * .45)) * min(1, (duration - t) / .3)
        # Soft electric-piano harmonics with slight natural beating.
        tone = sin(2*pi*freq*t) + .22*sin(2*pi*freq*2.003*t) + .07*sin(2*pi*freq*3*t)
        value = tone * env * gain
        k = int(start * RATE) + j
        left[k] += value * (1-pan*.6)
        right[k] += value * (1+pan*.6)

# A restrained low pulse under the middle of the film, 82 beats per minute.
beat_times=([0,.55,1.1]+[2+beat*60/82 for beat in range(22)] if PRICES else [4.7+beat*60/82 for beat in range(16)])
for start in beat_times:
    for j in range(int(.28 * RATE)):
        k = int(start*RATE)+j
        if k >= len(left): break
        t=j/RATE
        kick=.10*exp(-t*19)*sin(2*pi*(47*t+1.5*(1-exp(-t*20))))
        left[k]+=kick;right[k]+=kick

# The light variant uses smooth air swells, with no paper-rustle flutter.
intro_effects = [(.45,.18,.045),(1,.18,.045)] if PRICES else [(.05,1.35,.055),(1.2,.65,.065)] if LIGHT_REVEAL else [(1.35,1.9,.12)]
transitions=[(1.85,.3,.035),(5.65,.3,.035),(8.45,.3,.035),(11.35,.3,.035),(13.85,.4,.04)] if PRICES else [(4.55, .36, .035), (8.35, .36, .035), (11.15, .36, .035), (14.05, .55, .045)]
for start, duration, gain in intro_effects + transitions:
    low=0
    for j in range(int(duration*RATE)):
        k=int(start*RATE)+j
        if k>=len(left): break
        p=j/(duration*RATE)
        low=.84*low+.16*random.uniform(-1,1)
        flutter=1 if LIGHT_REVEAL or PRICES else .4+.6*abs(sin(j/RATE*41))
        value=low*sin(pi*p)**1.3*flutter*gain
        left[k]+=value*(1-.25*p);right[k]+=value*(.75+.25*p)

if LIGHT_REVEAL:
    # A brief, soft shutter transient under the single visual flash.
    low=0
    for j in range(int(.065*RATE)):
        k=int(1.46*RATE)+j
        noise=random.uniform(-1,1);low=.8*low+.2*noise
        click=(noise-low)*exp(-j/RATE*110)*.028
        left[k]+=click;right[k]+=click

pcm=array('h')
peak=0
for i,(l,r) in enumerate(zip(left,right)):
    t=i/RATE
    fade=min(1,t/.5,max(0,(DURATION-t)/1.25))
    for value in (l,r):
        value=tanh(value*1.45)*fade
        peak=max(peak,abs(value))
        pcm.append(round(value*32767))

output=Path(__file__).resolve().parents[1]/'assets'/('kulture-prices-score.wav' if PRICES else 'kulture-light-reveal-score.wav' if LIGHT_REVEAL else 'kulture-original-score.wav')
with wave.open(str(output),'wb') as wav:
    wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(RATE);wav.writeframes(pcm.tobytes())
print(f'Saved {output.name}: {DURATION}s stereo, peak {peak:.3f}, no clipping.')
