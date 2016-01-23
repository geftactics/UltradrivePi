The DCX2496 serial communication follows the midi sysex protocol.
Format is 38400 Bd, 8 databits, no parity, 1 stopbit.
RTS gating on RS485.


Sysex command header:
---------------------
F0 00 20 32 [deviceID] 0E [function] [data] F7
deviceID: 00..0f (channel 1..16)


Remote control enable command:
------------------------------
function: 3F
data: 04 00 (receive direct parameter change enable)
data: 08 00 (transmit direct parameter change enable)
data: 0C 00 (receive & transmit direct parameter change enable)


Direct parameter change command:
--------------------------------
function: 20
data: [numberofparams] * [ [channel] [parameternum] [valuehi] [valuelo] ]
numberofparams: number of following 4 byte parameter changes

channel: 00 (setup)
 01..03 (input A..C)
 04 (input SUM)
 05..0A (output 1..6)

parameternum: (setup)
02 input sum type 0..6 (off, A, B, C, A+B, A+C, B+C)
 03 onoff (1=on)
 04 input C gain (0:line, 1:mic)
 05 output config 0..3 (MONO, LMHLMH, LLMMHH, LHLHLH)
 06 stereo link (1:on)
 07 in stereo link 0..3 (off, a+b, a+b+c, a+b+c+sum)
 08 delay link (1:on)
 09 xover link (1:on)
 0A delay correction (1:on)
 0B air temp 0..70 (-20..+50 (deg centigrade always))
 14 delay units (0:mm, 1:inch)
 15 mute outs (1:on)
 16 in A sum gain 0..300 (-15..+15dB, step 0.1dB)
 17 in B sum gain 0..300 (-15..+15dB, step 0.1dB)
 18 in C sum gain 0..300 (-15..+15dB, step 0.1dB)

 (in/out)
 02 gain 0..300 (-15..+15dB, step 0.1dB)
 03 mute (1:muted)
 04 delay switch (1:on)
 05 delay 0..4000 (0..200m step 5cm)
 06 eq switch (1:on)
 07 eq number 0..9
 08 eq index 0..9
 09 dyn eq attack 0..109 (0..200ms log)
 0A dyn eq release 0..251 (20..4000ms log)
 0B dyn eq ration 0..15 (1:1.1 .. 1:inf)
 0C dyn eq thresh 0..600 (-60..0dB step 0.1dB)
 0D dyn eq switch (1:on)
 0E dyn eq freq 0..320 (20..20k log)
 0F dyn eq Q 0..40 (0.1..10 log)
 10 dyn eq gain 0..300 (-15..+15dB, step 0.1dB)
 11 dyn eq filter (0:low shelv, 1:bandpass, 2:hi shelv)
 12 dyn eq shelv slope (0:6dB, 1:12dB)
 13 eq #1 freq 0..320 (20..20k log)
 14 eq #1 Q 0..40 (0.1..10 log) 
 15 eq #1 gain 0..300 (-15..+15dB, step 0.1dB)
 16 eq #1 filter (0:low shelv, 1:bandpass, 2:hi shelv)
 17 eq #1 shelv slope (0:6dB, 1:12dB)
 ..
 3B eq #9 freq 0..320 (20..20k log)
 3C eq #9 Q 0..40 (0.1..10 log)
 3D eq #9 gain 0..300 (-15..+15dB, step 0.1dB)
 3E eq #9 filter (0:low shelv, 1:bandpass, 2:hi shelv)
 3F eq #9 shelv slope (0:6dB, 1:12dB)

 (output)
 40 name 0..1B (FULL RANGE..CENTER HI)
 41 input source 0..3 (A, B, C, SUM)
 42 hp filter 0..10 (off, but6, but12, bes12, lr12, but18, but
 bes24, lr24, but48, lr48)
 43 hp freq 0..320 (20..20k log)
 44 hp filter 0..10 (off, but6, but12, bes12, lr12, but18, but
 bes24, lr24, but48, lr48)
 45 hp freq 0..320 (20..20k log)
 46 limiter switch (1:on)
 47 lim thresh 0..240 (-24..0dB step 0.1dB)
 48 lim release 0..251 (20..4000ms log)
 49 polarity (1:inverse)
 4A phase 0..36 (0..180deg step 5deg)
 4B short delay 0..2000 (0..4000mm step 2mm)

valuehi: bits 7..13 of parameter value
valuelo: bits 6..0 of parameter value


Example:
--------

Enable recieving of commands
F0 00 20 32 00 0E 3F 04 00 F7

Set in A gain of device #1 to +6dB
F0 00 20 32 00 0E 20 01 01 02 01 52 F7 

Set in B gain of device #1 to +6dB
F0 00 20 32 00 0E 20 01 02 02 01 52 F7 
