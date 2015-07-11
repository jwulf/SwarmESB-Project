# SwarmESB-Project

A Project Build Structure for SwarmESB

* Maintain a separation of concern between the upstream SwarmESB project and your custom code. 
* Track upstream changes easily.
* Keep your custom code in a separate repository if you need it private.
* Maintain separation between "the code you write" and "the code you run" - good for testing and release engineering.

When cloning this project, use the ```--recursive``` switch to get the submodules. That is:

```
git clone --recursive {url}
```

To create a new project, run ```./esbproject new {projectname}```.

This creates a new project structure in ```projects/{projectname}```.

Edit your custom adapters, swarms, tests, and other code in there.

Then run ```./esbproject compile {projectname}```.

This compiles SwarmESB and your custom code in ```/projects/{projectname}/build```.

You can create custom build steps in ```/projects/{projectname}/meta/gulpfile.js```.

Run the ESB using ```container/dev-start.sh``` while testing your build in development. Use ```build.sh``` to build a Docker image.
