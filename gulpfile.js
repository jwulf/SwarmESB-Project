var gulp = require('gulp');
var ignore = require('gulp-ignore');
var install = require("gulp-install");
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var git = require('gulp-git');
var del = require('del');
var chalk = require('chalk');
var gutil = require('gulp-util');
var fs = require('fs');
var debug = require('debug')('Project Gulp'); 
var path = require("path");

var gitbranch = process.env.SWARMESB_BRANCH || null;
var project_path = process.env.SWARMESB_SRC_PATH;

gutil.log(chalk.magenta('Working with project code from '), chalk.green(project_path));
if (gitbranch) {
  gutil.log(chalk.magenta('Using SwarmESB git branch '), chalk.green(gitbranch));
}

var paths = {
  ESB: 'SwarmESB/**',
  SRC: path.join(project_path, '/src'),
  DEST: path.join(project_path, '/build'),
};

// Create and switch to a git branch 
gulp.task('builder:checkout', function(){
  if (gitbranch) {
    git.checkout(gitbranch, function (err) {
      if (err) throw err;
    });
  }
});
 
 gulp.task('builder:clean:build', function (cb) {
   // If the build directory doesn't exist, let's create it
   if (!fs.existsSync(paths.DEST)) {
     fs.mkdirSync(paths.DEST);
   }
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    paths.DEST+'/**/*'
  ], cb);
});

gulp.task('builder:compile:esb', function () {
  return gulp.src(paths.ESB)
    .pipe(ignore.exclude('.git*'))
    .pipe(gulp.dest(paths.DEST));
});

gulp.task('builder:copy-all-the-things', function (){
  //copy all the src files to add to or overwrite the base ESB
  // and install any necessary package dependencies
  return gulp.src([
    paths.SRC + '/**/*', 
    '!' + paths.SRC + '/meta',
    '!' + paths.SRC + '/**/README.md'
    ])
    .pipe(gulp.dest(paths.DEST))
    .pipe(install());; 
});

gulp.task('builder:invoke-project-compile-task', function () {
  // Execute custom build tasks from projects
  var projectGulpFile = './' + project_path + '/meta/gulpfile.js';
  if (fs.existsSync(projectGulpFile)) {
    require(projectGulpFile);
    if (gulp.tasks['project:compile']) {
        gulp.start('project:compile');
      }  else {
      gutil.log(
        chalk.green("'project:compile' task "), 
        chalk.red(' not found in '),
        chalk.red(projectGulpFile)
        );   
      }    
  }
});

gulp.task('builder:compile', function (cb) {
  runSequence(
    'builder:clean:build',
    'builder:compile:esb',
    'builder:copy-all-the-things',
    'builder:invoke-project-compile-task',
    cb);
});

gulp.task('builder:run', ['builder:compile'], function () {
  exec('bash container/start-dev.sh', {cwd: 'build/'}, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('builder:build-docker-image', function (){
  	  // Not implemented yet
});

gulp.task('builder:build-docker', ['builder:compile'], function (cb) {
  runSequence(
    'builder:build-docker-image',
    cb);
});

