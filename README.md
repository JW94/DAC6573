# DAC6573
=========

A module to interact with the dac6573-DAC

## Installation

  npm install dac6573 --save

## Usage
var dac = new dac6573('/dev/i2c-2',0x4C);

dac.setDACVoltage("dac0",2.2,function(err)
{
    if(err)
    {
        console.log(err);
    }
});

## Release History

* 1.0.0 Published and tested
* 0.0.1 Initial release
