var express = require('express');
app = express();

server = require('http').createServer(app);
io = require('socket.io').listen(server);

server.listen(80);
app.use(express.static('public'));     

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
         var p = new Buffer(4);
         data.copy(p, 0, 8+(i*4), 12+(i*4));
         getUltradrive(p);
      }
   }

});



var settings = [];
for (var i=0; i<11; i++) {
   settings[i] = [];
}



io.sockets.on('connection', function (socket) {
        socket.on('update', function (channel,param,value) {
                settings[channel][param] = value;
                setUltradrive(channel, param, value);
                io.sockets.emit('update', channel, param, value);   
        });
       
        // Send our 'in-memory' settings to newly connecting clients

        for (var c = 0; c < settings.length; c++) {
           for (var p = 0; p < settings[c].length; p++) {
              if (settings[c][p]) {
                 socket.emit('update', c, p, settings[c][p]);
              }
           }
        }        

});



function setUltradrive(channel,param,value) {
   valueHi = Math.floor(value / 128);
   valueLow = value % 128;
   var buf = new Buffer([0xF0, 0x00, 0x20, 0x32, 0x00, 0x0E, 0x20, 01, channel, param, valueHi, valueLow, 0xF7 ]);
   sp.write(buf);
   console.log(buf);
}



function setUI(channel,param,value) {
   settings[channel][param] = value;
   io.sockets.emit('update', channel, parameterNum, value)
}



function getUltradrive(param) {

   channel = param[0];
   parameterNum = param[1];
   value = param.readInt8(2) * 128 + param.readInt8(3)

   if(channel==0x00) { // Setup
      switch(parameterNum) {
         case 0x02: console.log('['+channel+'] input sum type = ' + value); break;
         case 0x03: console.log('['+channel+'] onoff = ' + value); break;
         case 0x04: console.log('['+channel+'] input C gain = ' + value); break;
         case 0x05: console.log('['+channel+'] output config = ' + value); break;
         case 0x06: console.log('['+channel+'] stereo link = ' + value); break;
         case 0x07: console.log('['+channel+'] input stereo link = ' + value); break;
         case 0x08: console.log('['+channel+'] delay link = ' + value); break;
         case 0x09: console.log('['+channel+'] xover link = ' + value); break;
         case 0x0A: console.log('['+channel+'] delay correction = ' + value); break;
         case 0x0B: console.log('['+channel+'] air temp = ' + value); break;
         case 0x14: console.log('['+channel+'] delay units = ' + value); break;
         case 0x15: console.log('['+channel+'] mute outs = ' + value); break;
         case 0x16: console.log('['+channel+'] input A sum gain = ' + value); break;
         case 0x17: console.log('['+channel+'] input B sum gain = ' + value); break;
         case 0x18: console.log('['+channel+'] input C sum gain = ' + value); break;
      }
   }

   if(channel>=0x01 && channel<=0x0A) { // Inputs & Outputs
      switch(parameterNum) {
         case 0x02: console.log('['+channel+'] gain = ' + value); setUI(channel, parameterNum, value); break;
         case 0x03: console.log('['+channel+'] mute = ' + value); break;
         case 0x04: console.log('['+channel+'] delay switch = ' + value); break;
         case 0x05: console.log('['+channel+'] delay = ' + value); break;
         case 0x06: console.log('['+channel+'] eq switch = ' + value); break;
         case 0x07: console.log('['+channel+'] eq number = ' + value); break;
         case 0x08: console.log('['+channel+'] eq index = ' + value); break;
         case 0x09: console.log('['+channel+'] dyn eq attack = ' + value); break;
         case 0x0A: console.log('['+channel+'] dyn eq release = ' + value); break;
         case 0x0B: console.log('['+channel+'] dyn eq rotation = ' + value); break;
         case 0x0C: console.log('['+channel+'] dyn eq thresh = ' + value); break;
         case 0x0D: console.log('['+channel+'] dyn eq switch = ' + value); break;
         case 0x0E: console.log('['+channel+'] dyn eq freq = ' + value); break;
         case 0x0F: console.log('['+channel+'] dyn eq Q = ' + value); break;
         case 0x10: console.log('['+channel+'] dyn eq gain = ' + value); break;
         case 0x11: console.log('['+channel+'] dyn eq filter = ' + value); break;
         case 0x12: console.log('['+channel+'] dyn eq shelv slope = ' + value); break;
         case 0x13: console.log('['+channel+'] eq #1 freq = ' + value); break;
         case 0x14: console.log('['+channel+'] eq #1 Q = ' + value); break;
         case 0x15: console.log('['+channel+'] eq #1 gain = ' + value); break;
         case 0x16: console.log('['+channel+'] eq #1 filter = ' + value); break;
         case 0x17: console.log('['+channel+'] eq #1 shelv slope = ' + value); break;
         case 0x3B: console.log('['+channel+'] eq #9 freq = ' + value); break;
         case 0x3C: console.log('['+channel+'] eq #9 Q = ' + value); break;
         case 0x3D: console.log('['+channel+'] eq #9 gain = ' + value); break;
         case 0x3E: console.log('['+channel+'] eq #9 filter = ' + value); break;
         case 0x3F: console.log('['+channel+'] eq #9 shelv slope = ' + value); break;
      }
   }

   if(channel>=0x05 && channel<=0x0A) { // Outputs
      switch(parameterNum) {
         case 0x40: console.log('['+channel+'] name = ' + value); break;
         case 0x41: console.log('['+channel+'] input source = ' + value); break;
         case 0x42: console.log('['+channel+'] xover filter #1 = ' + value); break;
         case 0x43: console.log('['+channel+'] xover freq #1 = ' + value); break;
         case 0x44: console.log('['+channel+'] xover filter #2 = ' + value); break;
         case 0x45: console.log('['+channel+'] xover freq #2 = ' + value); break;
         case 0x46: console.log('['+channel+'] limiter switch = ' + value); break;
         case 0x47: console.log('['+channel+'] limiter thresh = ' + value); break;
         case 0x48: console.log('['+channel+'] limiter release = ' + value); break;
         case 0x49: console.log('['+channel+'] polarity = ' + value); break;
         case 0x4A: console.log('['+channel+'] phase = ' + value); break;
         case 0x4B: console.log('['+channel+'] short delay = ' + value); break;
      }
   }

}

