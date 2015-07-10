# SwarmESB-Project

A Project Build Structure for SwarmESB

* Maintain a separation of concern between the upstream SwarmESB project and your custom code. 
* Track upstream changes easily.
* Keep your custom code in a separate repository if you need it private.
* Maintain separation between "the code you write" and "the code you run" - good for testing and release engineering.

Put your customer adapters, swarms, and tests into ```src```. You can make ```src``` a git submodule for another repository.

To build, run ```gulp build```.

This copies SwarmESB into ```build```, then copies your custom adapters, swarms, and tests.

