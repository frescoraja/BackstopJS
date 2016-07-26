var gulp   = require('gulp');
var rename = require('gulp-rename');
var paths  = require('../util/paths');
var argv   = require('yargs').argv;
var fsx    = require('fs-extra');
/**
 * Copies a boilerplate config file to the current config file location.
 */
// gulp.task('genConfig', ['genScripts'], function(){
//   return gulp.src(paths.captureConfigFileNameDefault)
//     .pipe(rename(paths.backstopConfigFileName))
//     .pipe(gulp.dest('/'));
// });

gulp.task('genConfig', function() {
  if(fsx.existsSync(paths.backstopJSConfigPath)) {  
    var JSconfig = require(paths.backstopJSConfigPath);
    var oldConfigJson = fsx.readJsonSync(paths.activeCaptureConfigPath, { throws: false }) || {};
    var newChecksum = checksum(JSON.stringify(JSconfig));

    if(newChecksum !== oldConfigJson.checksum) {
      console.log("Detected changes in JS generator script, writing new backstop.json config file..");
      var newConfig = require(paths.backstopJSConfigPath);
      newConfig.checksum = newChecksum;
      fsx.outputJsonSync(paths.activeCaptureConfigPath, newConfig);
    }
  }
});