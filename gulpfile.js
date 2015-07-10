var gulp = require('gulp');
var changed = require('gulp-changed');
var ignore = require('gulp-ignore');
var install = require("gulp-install");
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var git = require('gulp-git');
var rimraf = require('rimraf');
var fs = require('fs');
 
var gitbranch = 'my-production';
 
var paths = {
  ESB: 'SwarmESB/**',
  SRC: 'src',
  DEST: 'build',
};

// Create and switch to a git branch 
gulp.task('checkout', function(){
  git.checkout(gitbranch, function (err) {
    if (err) throw err;
  });
});
 
 gulp.task('clean-builddir', function (cb) {
    rimraf(paths.DEST+'/*', cb);
}); 

gulp.task('build-esb', function () {
  return gulp.src(paths.ESB)
    .pipe(ignore('.git*'))
    .pipe(gulp.dest(paths.DEST));
});

gulp.task('copy-all-the-things', function (){
  //copy all the src files to add to or overwrite the base ESB
  // and install any necessary package dependencies
  return gulp.src('src/**/*')
    .pipe(gulp.dest(paths.DEST))
    .pipe(install());; 
});

gulp.task('build', function (cb) {
  runSequence(
    'clean-builddir',
    'build-esb',
    'copy-all-the-things',
    cb);
});

gulp.task('run', ['build'], function () {
  exec('bash container/start-dev.sh', {cwd: 'build/'}, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task('build-docker-image', function (){
  	  // Not implemented yet
});

gulp.task('build-docker', ['build'], function (cb) {
  runSequence(
    'build-docker-image',
    cb);
});

