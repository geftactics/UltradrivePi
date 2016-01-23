# UltradrivePi
Raspberry Pi control of the Behringer Ultradrive DCX2496 via RS232.

This is very much work in progress. The end goal is to be able to have a Raspberry Pi connected to the serial/RS232 port on the DCX2496, which will allow us wireless/Wi-Fi control via smartphone or iPad etc.

We can currently run dcx.js to watch realtime changes being made on the DCX2496. Future developments will involve showing these changes on a GUI, and being able to send changes from the GUI back to the Pi, then onto the DCX2496 if valid.

A level converter board is required for serial comms between the two devices, as RS232 requires 5V levels.
