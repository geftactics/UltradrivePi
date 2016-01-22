var serialport = require('serialport');
SerialPort = serialport.SerialPort;


var sp = new SerialPort("/dev/ttyAMA0", {
   baudRate: 38400,
   parser: serialport.parsers.readline('f7', 'hex')
 });



sp.on('open', function () {
   console.log('Serial port open @ ' + sp.options.baudRate + ' bps');
   sp.write(Buffer('F0002032000E3F0C00F7', 'hex'));
});



sp.on('data', function (data) {

   data = Buffer(data + 'f7', 'hex');

   if (data[0]!=0xF0 || data[1]!=0x00 || data[2]!=0x20 || data[3]!=0x32 || data[5]!=0x0E || data[data.length-1]!=0xF7) {
      console.log('Bad data recieved!');
      return;
   }

   dataFunction = data[6];

   if (dataFunction==0x20) {
      paramCount = data[7];
      for (i=0; i<paramCount; i++) {
         var param = new Buffer(4);
         data.copy(param, 0, 8+(i*4), 12+(i*4));
         setUltradrive(param);
      }
   }

});



function setUltradrive(param) {

   channel = param[0];
   parameterNum = param[1];
   valueHi = param[2]
   valueLow = param[3];

   if(channel==0x00) { // Setup
      switch(parameterNum) {
         case 0x02: console.log('['+channel+'] input sum type'); break;
         case 0x03: console.log('['+channel+'] onoff'); break;
         case 0x04: console.log('['+channel+'] input C gain'); break;
         case 0x05: console.log('['+channel+'] output config'); break;
         case 0x06: console.log('['+channel+'] stereo link'); break;
         case 0x07: console.log('['+channel+'] input stereo link'); break;
         case 0x08: console.log('['+channel+'] delay link'); break;
         case 0x09: console.log('['+channel+'] xover link'); break;
         case 0x0A: console.log('['+channel+'] delay correction'); break;
         case 0x0B: console.log('['+channel+'] air temp'); break;
         case 0x14: console.log('['+channel+'] delay units'); break;
         case 0x15: console.log('['+channel+'] mute outs'); break;
         case 0x16: console.log('['+channel+'] input A sum gain'); break;
         case 0x17: console.log('['+channel+'] input B sum gain'); break;
         case 0x18: console.log('['+channel+'] input C sum gain'); break;
      }
   }

   if(channel>=0x01 && channel<=0x0A) { // Inputs & Outputs
      switch(parameterNum) {
         case 0x02: console.log('['+channel+'] gain'); break;
         case 0x03: console.log('['+channel+'] mute'); break;
         case 0x04: console.log('['+channel+'] delay switch'); break;
         case 0x05: console.log('['+channel+'] delay'); break;
         case 0x06: console.log('['+channel+'] eq switch'); break;
         case 0x07: console.log('['+channel+'] eq number'); break;
         case 0x08: console.log('['+channel+'] eq index'); break;
         case 0x09: console.log('['+channel+'] dyn eq attack'); break;
         case 0x0A: console.log('['+channel+'] dyn eq release'); break;
         case 0x0B: console.log('['+channel+'] dyn eq rotation'); break;
         case 0x0C: console.log('['+channel+'] dyn eq thresh'); break;
         case 0x0D: console.log('['+channel+'] dyn eq switch'); break;
         case 0x0E: console.log('['+channel+'] dyn eq freq'); break;
         case 0x0F: console.log('['+channel+'] dyn eq Q'); break;
         case 0x10: console.log('['+channel+'] dyn eq gain'); break;
         case 0x11: console.log('['+channel+'] dyn eq filter'); break;
         case 0x12: console.log('['+channel+'] dyn eq shelv slope'); break;
         case 0x13: console.log('['+channel+'] eq #1 freq'); break;
         case 0x14: console.log('['+channel+'] eq #1 Q'); break;
         case 0x15: console.log('['+channel+'] eq #1 gain'); break;
         case 0x16: console.log('['+channel+'] eq #1 filter'); break;
         case 0x17: console.log('['+channel+'] eq #1 shelv slope'); break;
         case 0x3B: console.log('['+channel+'] eq #9 freq'); break;
         case 0x3C: console.log('['+channel+'] eq #9 Q'); break;
         case 0x3D: console.log('['+channel+'] eq #9 gain'); break;
         case 0x3E: console.log('['+channel+'] eq #9 filter'); break;
         case 0x3F: console.log('['+channel+'] eq #9 shelv slope'); break;
      }
   }

   if(channel>=0x05 && channel<=0x0A) { // Outputs
      switch(parameterNum) {
         case 0x40: console.log('['+channel+'] name'); break;
         case 0x41: console.log('['+channel+'] input source'); break;
         case 0x42: console.log('['+channel+'] xover filter #1'); break;
         case 0x43: console.log('['+channel+'] xover freq #1'); break;
         case 0x44: console.log('['+channel+'] xover filter #2'); break;
         case 0x45: console.log('['+channel+'] xover freq #2'); break;
         case 0x46: console.log('['+channel+'] limiter switch'); break;
         case 0x47: console.log('['+channel+'] limiter thresh'); break;
         case 0x48: console.log('['+channel+'] limiter release'); break;
         case 0x49: console.log('['+channel+'] polarity'); break;
         case 0x4A: console.log('['+channel+'] phase'); break;
         case 0x4B: console.log('['+channel+'] short delay'); break;
      }
   }

   console.log(param);
   console.log('---------------');
}
