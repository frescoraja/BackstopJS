var paths    = require('../util/paths');
var fsx       = require('fs-extra');
var checksum = require('checksum');

var config = require(paths.activeCaptureConfigPath);
// Serialize config as JSON into capture config.
fsx.writeFileSync(paths.captureConfigFileName, JSON.stringify(config));
