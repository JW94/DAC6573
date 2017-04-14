'use strict';
var i2c = require('i2c');

/**
 * DAC6573
 * https://github.com/JW94/DAC6573.git
 *
 * Copyright (c) 2017 Jonathan Weinert
 * Licensed under the MIT license.
 */
 

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

 /**
 * Constructor
 *
 * @param  {string} device
 * @param  {number} address
 */

var dac6573 = function(device, address) 
{
    this.device = device;
    this.address = address;
    this.wire = new i2c(this.address,{device: this.device});
}

/**
 * Shift data to the right byte-format and send it to the dac6573
 *
 * @param  {string} channel
 * @param  {number} value
 */

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

/**
 * Calculate the right dac-value in relation of the passed voltage 
 *
 * @param  {string} channel
 * @param  {number} value
 */


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

// Some tests
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