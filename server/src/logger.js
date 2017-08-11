const Logger = require('transport-logger');
const config = require('./schedule.js').getConfig();
const path = require('path');
let logFile = config.logFile || '/var/log/aquarium-control/log';
if (!path.isAbsolute(logFile)) {
	logFile = path.join(path.dirname(config.configPath), logFile);
}

if (logFile) {
	module.exports = new Logger([{
		destination: logFile,
		minLevel: 'info',
		timestamp: true,
		prependLevel: true,
		colorize: false,
		maxLines: 200
	}, {
		minLevel: 'trace',
		timestamp: true,
		prependLevel: true,
		colorize: true
	}]);
}
else {
	module.exports = new Logger({
		minLevel: 'trace',
		timestamp: true,
		prependLevel: true,
		colorize: true
	});
}
