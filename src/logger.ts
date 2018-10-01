import * as winston from 'winston';

import { CONFIG } from '../conf/config';

export const logger = winston.createLogger({
	transports: [
		new winston.transports.File({
			level: 'info',
			filename: CONFIG.logFile,
			handleExceptions: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			format: winston.format.combine(
				winston.format.splat(),
			),
		}),
		new winston.transports.Console({
			level: 'debug',
			handleExceptions: true,
			format: winston.format.combine(
				winston.format.splat(),
				winston.format.simple(),
			),
		})
	],
	exitOnError: false
});
