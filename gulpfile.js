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

var gitbranch = process.env.SWARMESB_BRANCH || 'my-production';
var src_path = process.env.SWARMESB_SRC_PATH || 'src';

gutil.log(chalk.magenta('Working with project code from '), chalk.green(src_path));
gutil.log(chalk.magenta('Using SwarmESB git branch '), chalk.green(gitbranch));

var paths = {
  ESB: 'SwarmESB/**',
  SRC: src_path,
  DEST: 'build',
};

// Create and switch to a git branch 
gulp.task('builder:checkout', function(){
  git.checkout(gitbranch, function (err) {
    if (err) throw err;
  });
});
 
 gulp.task('builder:clean:build', function (cb) {
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    paths.DEST+'/**/*'
  ], cb);
});

gulp.task('builder:build:esb', function () {
  return gulp.src(paths.ESB)
    .pipe(ignore.exclude('.git*'))
    .pipe(gulp.dest(paths.DEST));
});

gulp.task('builder:copy-all-the-things', function (){
  //copy all the src files to add to or overwrite the base ESB
  // and install any necessary package dependencies
  return gulp.src([
    paths.SRC + '/**/*', 
    '!' + paths.SRC + '/esb-project-config.js',
    '!' + paths.SRC + '/**/README.md',
    '!' + paths.SRC + '/gulpfile.js'
    ])
    .pipe(gulp.dest(paths.DEST))
    .pipe(install());; 
});

gulp.task('builder:invoke-project-build-task', function () {
  // Execute custom build tasks from projects
  if (fs.existsSync('./' + src_path + '/gulpfile.js')) {
    require('./' + src_path + '/gulpfile.js');
    if (gulp.tasks['project:build']) {
        gulp.start('project:build');
      }  else {
      gutil.log(
        chalk.green("'project:build' task "), 
        chalk.red(' not found in '),
        chalk.red(src_path + '/gulpfile.js!')
        );   
      }    
  }
});

gulp.task('builder:build', function (cb) {
  runSequence(
    'builder:clean:build',
    'builder:build:esb',
    'builder:copy-all-the-things',
    'builder:invoke-project-build-task',
    cb);
});

gulp.task('builder:run', ['builder:build'], function () {
  exec('bash container/start-dev.sh', {cwd: 'build/'}, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('builder:build-docker-image', function (){
  	  // Not implemented yet
});

gulp.task('builder:build-docker', ['builder:build'], function (cb) {
  runSequence(
    'builder:build-docker-image',
    cb);
});

