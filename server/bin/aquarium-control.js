#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = '../../conf/config.json';

program
	.version(require('../../package.json').version)
	.option(
		'-c, --config [config]',
		'Specify the location of the config file. Defaults to ' + DEFAULT_CONFIG,
		DEFAULT_CONFIG
	)
	.parse(process.argv);

if (!fs.existsSync(program.config)) {
	console.error('No config file found at "' + program.config + '"');
	process.exit(1);
}
let config = fs.readFileSync(program.config);
try {
	config = JSON.parse(config);
} catch (e) {
	console.error('Could not parse ' + type + ' file: ' + e);
	process.exit(1);
}
config.configPath = path.resolve(program.config);

require('../src/schedule.js').setConfig(config);
require('../src/server.js');
require('../src/controller.js');
