var gulp   = require('gulp');
var rename = require('gulp-rename');
var paths  = require('../util/paths');
var argv   = require('yargs').argv;
/**
 * Copies a boilerplate config file to the current config file location.
 */
gulp.task('genConfig', ['genScripts'], function(){
  return gulp.src(paths.captureConfigFileNameDefault)
    .pipe(rename(paths.backstopConfigFileName))
    .pipe(gulp.dest('/'));
});
