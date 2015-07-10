# SwarmESB-Project

A Project Build Structure for SwarmESB

* Maintain a separation of concern between the upstream SwarmESB project and your custom code. 
* Track upstream changes easily.
* Keep your custom code in a separate repository if you need it private.
* Maintain separation between "the code you write" and "the code you run" - good for testing and release engineering.

Put your customer adapters, swarms, and tests into ```src```. 

To build, run ```gulp build```.

This copies SwarmESB into ```build```, then copies your custom adapters, swarms, and tests.

You can use a git submodule from another repository as your ```src``` folder. This allows you to track the upstream SwarmESB, track changes from this project structure, and maintain your private code on a private server.

To do this: copy the ```src``` folder to the new git submodule, and edit ```src/build-scripts/build``` to set the name of your source submodule.

For example: if you were to host your custom code in a private repository called ```custom-code```, starting with an empty repository you would do:

```
cd SwarmESB
git submodule add https://myprivategitrepo.com/custom-code
cd custom-code
git submodule init
git submodule update
cp ./../src/* .
```
Then edit ```custom-code/build-scripts/build``` and set:

```
export SWARMESB_SRC_PATH='custom-code'
```

Then add and commit your code as per normal in the ```custom-code``` directory.

Now, to build the project you would execute:

```
cd SwarmESB
custom-code/build-scripts/build
```
