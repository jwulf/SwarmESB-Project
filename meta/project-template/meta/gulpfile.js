var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = require ('chalk');

var gitbranch = process.env.SWARMESB_BRANCH;
var src_path = process.env.SWARMESB_SRC_PATH;

var paths = {
  ESB: 'SwarmESB/**',
  SRC: src_path,
  DEST: 'build',
};

/* The project:compile task is called by the build compiler after the SwarmESB and custom code have been 
  copied to the buid directory.
  
  Use this task (and chain others to it), to remove things, move things around, and do any other changes you 
  need to do to have your compiled project whole and complete.

*/

gulp.task('project:compile', function () {
  // do nothing
  gutil.log(
    chalk.magenta('Default project:compile task does nothing.')
  )  
});
