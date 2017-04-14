'use strict';
var i2c = require('i2c');

var REF_VOLTAGE = 4.096;
var RES = 10;
var RES_STEPS = Math.pow(2,RES);
var DACVALUE_FACT = (RES_STEPS-1)/REF_VOLTAGE;
var CHANNELS = 
{
    "dac0": 0x10,
    "dac1": 0x12,
    "dac2": 0x1C,
    "dac3": 0x16
};

var dac6573 = function(device, address) 
{
    this.device = device;
    this.address = address;
    this.wire = new i2c(this.address,{device: this.device});
}

dac6573.prototype.setDACRaw = function(channel,value,callback)
{
    var self = this;
    var byte0 = ((value & 0x03)<<6);    //Least
    var byte1 = (value >> 2);   //Most
    self.wire.writeBytes(CHANNELS[channel], [byte1, byte0], function(err)
    {
        if(err)
        {
            callback(err);
        }
    });
}

dac6573.prototype.setDACVoltage = function(channel,voltage,callback)
{
    var self = this;
    var dacValue = DACVALUE_FACT * voltage;
    self.setDACRaw(channel, dacValue, function(err)
    {
        if(err)
        {
            callback(err);
        }
    });
}

dac6573.prototype.iterate = function(iterations, process, exit)
{
    var self = this;
    var index = 0, done = false, shouldExit = false;
    var loop = 
    {
        next:function()
        {
            if(done)
            {
                if(shouldExit && exit);
                {
                    
                }
            }
            if(index < iterations)
            {
                index++;
                process(loop);
            }
            else
            {
                done = true;
                if(exit)
                {
                    exit();
                }
            }
        },
        iteration:function()
        {
            return index - 1;
        },
        break:function(end)
        {
            done = true;
            shouldExit = end;
        }
    };
    loop.next();
};

//var dac = new dac6573('/dev/i2c-2',0x4C);

// dac.setDACRaw(dac0, 511, function(err)
// {
    // if(err)
    // {
        // console.log(err);
    // }
// });
// dac.setDACVoltage("dac0",2.2,function(err)
// {
    // if(err)
    // {
        // console.log(err);
    // }
// });
module.exports = dac6573;