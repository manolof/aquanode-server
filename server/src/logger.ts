import * as path from 'path';
import * as Logger from 'transport-logger';

import { Config } from './interfaces';
import { configuration } from './config';

const config: Config = configuration.get();

let logFile = config.logFile || '/var/log/aquarium-control/log';
if (!path.isAbsolute(logFile)) {
	logFile = path.join(path.dirname(config.configPath as string), logFile);
}

export const logger = logFile ?
	new Logger([{
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
	}])
	:
	new Logger({
		minLevel: 'trace',
		timestamp: true,
		prependLevel: true,
		colorize: true
	});