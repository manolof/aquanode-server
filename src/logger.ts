import * as winston from 'winston';

import { CONFIG } from '../conf/config';

const { transports, format, createLogger } = winston;
const { File, Console } = transports;
const { combine, timestamp, simple, printf } = format;

const formatOptions = combine(
	simple(),
	timestamp({
		format: 'YYYY-MM-DD HH:mm:ss',
	}),
	printf((info) => `${info.level}: ${info.message} ............... [${info.timestamp}]`),
);

const logFileOptions = {
	handleExceptions: true,
	maxsize: 5242880, // 5MB
	maxFiles: 5,
	format: formatOptions,
};

const logConsoleOptions = {
	handleExceptions: true,
	format: formatOptions,
};

export const logger = createLogger({
	transports: [
		new File({
			...logFileOptions,
			level: 'info',
			filename: CONFIG.logsPath + 'activity.log',
		}),
		new File({
			...logFileOptions,
			level: 'error',
			filename: CONFIG.logsPath + 'error.log',
		}),
		new Console({
			...logConsoleOptions,
			level: 'debug',
		}),
	],
	exitOnError: false,
});
