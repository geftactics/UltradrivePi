# UltradrivePi
Raspberry Pi control of the Behringer Ultradrive DCX2496 via RS232.

This is very much work in progress.

The end goal is to be able to have a Raspberry Pi connected to the serial/RS232 port on the DCX2496, which will allow us wireless/Wi-Fi control via smartphone or iPad etc.

We can currently run 'sudo node dcx.js' which will do a couple of things:
1) Show us live changes on the console of configuration changes made on the DCX2496
2) Run a web server on the local device (Port 80) that will allow remote control of gain for inputs/outputs

Future developments will involve making more changes available via the GUI.

A level converter board is required for serial comms between the two devices, as RS232 requires 5V levels.
