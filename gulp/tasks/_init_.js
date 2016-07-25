var paths    = require('../util/paths');
var fsx       = require('fs-extra');
var checksum = require('checksum');

if(fsx.existsSync(paths.backstopJSConfigPath)) {  
  var JSconfig = require(paths.backstopJSConfigPath);
  var oldConfigJson = fsx.readJsonSync(paths.activeCaptureConfigPath, { throws: false });
  var newChecksum = checksum(JSON.stringify(JSconfig));

  if(newChecksum !== oldConfigJson.checksum) {
    console.log("Detected changes in JS generator script, writing new backstop.json config file..");
    var newConfig = require(paths.backstopJSConfigPath);
    newConfig.checksum = newChecksum;
    fsx.outputJsonSync(paths.activeCaptureConfigPath, newConfig);
  }
}

var config = require(paths.activeCaptureConfigPath);
// Serialize config as JSON into capture config.
fsx.writeFileSync(paths.captureConfigFileName, JSON.stringify(config));
