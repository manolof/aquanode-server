import * as winston from 'winston';

import { CONFIG } from '../conf/config';

export const logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: CONFIG.logFile,
			handleExceptions: true,
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			json: false,
			colorize: true
		})
	],
	exitOnError: false
});
