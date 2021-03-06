var path = require('path');
var fs = require('fs-extra');
var argv = require('yargs').argv;
var defaultPort = 3001;
var defaultConfigPath = '../../backstop.json';
var defaultConfigJSPath = '../../backstop.js';

var paths = {};
paths.portNumber = defaultPort;
paths.ciReportOpts = {
    format: 'junit',
    testSuiteName: 'BackstopJS'
};

// BACKSTOP MODULE PATH
paths.backstop                      = path.join(__dirname, '../..');

function getBackstopJSConfigPath() {
  var jsConfigPathArg = argv.jsConfig || null;
  if (jsConfigPathArg) {
    var isAbsolutePath = jsConfigPathArg.charAt(0) === '/';
    var jsConfigPath = isAbsolutePath ? jsConfigPathArg : path.join(paths.backstop, jsConfigPathArg);
    if(!fs.existsSync(jsConfigPath)) {
      throw new Error('Couldn\'t resolve JS backstop config generator file');
    }
    return jsConfigPath;
  }
  return path.join(paths.backstop, defaultConfigJSPath);
}

function getBackstopConfigFileName() {
  var configPathArg = argv.backstopConfigFilePath || argv.config || null;
  if(configPathArg) {
    var isAbsolutePath = configPathArg.charAt(0) === '/';
    var configPath = isAbsolutePath ? configPathArg : path.join(paths.backstop, configPathArg);
    if(!fs.existsSync(configPath)) {
      console.log('Couldn\'t resolve backstop config file');
    }
    return configPath;
  }
  return path.join(paths.backstop, defaultConfigPath);
}
// BACKSTOP CONFIG PATH
paths.backstopConfigFileName = getBackstopConfigFileName();
paths.backstopJSConfigPath = getBackstopJSConfigPath();

// BITMAPS PATHS -- note: this path is overwritten if config files exist.  see below.
paths.bitmaps_reference             = paths.backstop + '/bitmaps_reference';
paths.bitmaps_test                  = paths.backstop + '/bitmaps_test';

// Continuous Integration (CI) report
paths.ci_report_path                = paths.backstop + '/ci_report';

// COMPARE PATHS -- note: compareConfigFileName is overwritten if config files exist.  see below.
paths.comparePath                   = paths.backstop + '/compare';
paths.compareConfigFileName         = paths.comparePath+'/config.json';

// CAPTURE CONFIG PATHS
paths.captureConfigFileName         = paths.backstop + '/capture/config.json';
paths.captureConfigFileNameCache    = paths.backstop + '/capture/.config.json.cache';
paths.captureConfigFileNameDefault  = paths.backstop + '/capture/config.default.json';

// SCRIPTS PATHS -- note: scripts is overwritten if config file exists.
paths.casper_scripts                = null;
paths.casper_scripts_default        = paths.backstop + '/capture/casper_scripts';

// SERVER PID PATH
paths.serverPidFile                 = paths.backstop + '/server.pid';

// ACTIVE CAPTURE CONFIG PATH
paths.activeCaptureConfigPath       = '';

if(fs.existsSync(paths.backstopConfigFileName)){
  console.log('\nBackstopJS Config loaded at location', paths.backstopConfigFileName);
  paths.activeCaptureConfigPath = paths.backstopConfigFileName;
}else if(fs.existsSync(paths.backstopJSConfigPath)){
  console.log('\nConfig file not found. Generating new one from JS config.');
  var newConfig = require(paths.backstopJSConfigPath);
  fs.outputJsonSync(paths.backstopConfigFileName, newConfig);
  paths.activeCaptureConfigPath = paths.backstopConfigFileName;
}else {
  console.log('Config file not found, JS config not found.');
  console.log('\n`$ npm run genConfig` generates a handy configuration boilerplate file at: `' + paths.backstopConfigFileName + '`. (Will overwrite existing files.)\n')
  paths.activeCaptureConfigPath = paths.captureConfigFileNameDefault;
}

// overwrite default filepaths if config files exist
if(fs.existsSync(paths.activeCaptureConfigPath)){
  var config = require(paths.activeCaptureConfigPath);
  if (config.paths) {
    paths.bitmaps_reference = config.paths.bitmaps_reference || paths.bitmaps_reference;
    paths.bitmaps_test = config.paths.bitmaps_test || paths.bitmaps_test;
    paths.compareConfigFileName = config.paths.compare_data || paths.compareConfigFileName;
    paths.casper_scripts = config.paths.casper_scripts || null;
    paths.ci_report_path = config.paths.ci_report || paths.ci_report_path;
  }

  paths.portNumber = config.port || defaultPort;
  paths.casperFlags = config.casperFlags || null;
  paths.engine = config.engine || null;
  paths.report = config.report || null;
  paths.ciReportOpts = config.ci || paths.ciReportOpts;
}

paths.compareReportURL = 'http://localhost:' + paths.portNumber + '/compare/';

module.exports = paths;
