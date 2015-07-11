# SwarmESB-Project

A Project Build Structure for SwarmESB

* Track the upstream SwarmESB project and cherry pick changes / releases while you develop. 
* Keep your custom code in a private repo (if you want).
* Separate "the code you write" and "the code you run".

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
