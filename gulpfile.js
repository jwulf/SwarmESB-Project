var gulp = require('gulp');
var ignore = require('gulp-ignore');
var install = require("gulp-install");
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var exec = require('child_process').exec;
var git = require('gulp-git');
var del = require('del');
 
var gitbranch = process.env.SWARMESB_BRANCH || 'my-production';
 
var src_path = process.env.SWARMESB_SRC_PATH || 'src';

var paths = {
  ESB: 'SwarmESB/**',
  SRC: src_path,
  DEST: 'build',
};

// Create and switch to a git branch 
gulp.task('checkout', function(){
  git.checkout(gitbranch, function (err) {
    if (err) throw err;
  });
});
 
 gulp.task('clean:build', function (cb) {
  del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    paths.DEST+'/**/*'
  ], cb);
});

gulp.task('build:esb', function () {
  return gulp.src(paths.ESB)
    .pipe(ignore.exclude('.git*'))
    .pipe(gulp.dest(paths.DEST));
});

gulp.task('copy-all-the-things', function (){
  //copy all the src files to add to or overwrite the base ESB
  // and install any necessary package dependencies
  return gulp.src(paths.src + '/**/*')
    .pipe(ignore.exclude('./build-scripts'))
    .pipe(ignore.exclude('./**/README.md'))
    .pipe(gulp.dest(paths.DEST))
    .pipe(install());; 
});

gulp.task('build', function (cb) {
  runSequence(
    'clean:build',
    'build:esb',
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

