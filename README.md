# SwarmESB-Project

A Project Build Structure for SwarmESB

Maintain a separation of concern between the upstream SwarmESB project and your custom (and maybe proprietary or sensitive) code. 

This way you can track upstream changes easily, and also keep your custom code in a separate repository.

Also, you attain a distinction between "the code you write" and "the code you run", which  is
good for testing and release purposes.

Put your customer adapters, swarms, and tests into ```src```. You can make ```src``` a git submodule for another repository.

To build, run ```gulp build```.

This copies SwarmESB into ```build```, then copies your custom adapters, swarms, and tests.

