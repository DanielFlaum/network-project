To run this project, you will need:

* Node.js 16.15.0
* Gulp 2.3.0
* Python 3.10.8
* fish 3.5.1

The project is organized in phases, one in each numbered directory. Later phases use symbolic links into earlier phases to pipeline data.

1. Go into each numbered directory and run `npm install` (`npm` comes with Node.js).
1. Then, run the `build-all.fish` script in the project's root directory.
1. Then, run the `run.fish` scripts in each of the numbered directories.

Notice the directory `99-failed-louvain-attempt`. It contains a failed attempt at implementing my inverted Louvain's algorithm based on [https://www.npmjs.com/package/ngraph.louvain](https://www.npmjs.com/package/ngraph.louvain).

The directories `graphology-communities-inverted-louvain` and `graphology-inverted-indices` contain my successful attempt implementing my inverted Louvain's algorithm.
