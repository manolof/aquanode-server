import { existsSync, PathLike, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

import { Config, Program, Status } from './interfaces';

let schedulePath: PathLike;
const status: Status = {
	state: 'off'
};

let config: Config;
export const getConfig = (): Config => {
	return config;
};

export const setConfig = (contents: Config) => {
	config = contents;
};

export const getSchedule = (): Program => {
	schedulePath = path.resolve(path.dirname(config.configPath as string), config.schedule);
	if (!path.isAbsolute(schedulePath)) {
		schedulePath = path.join(path.dirname(config.configPath as string), schedulePath);
	}
	if (!existsSync(schedulePath)) {
		throw new Error('Could not find a schedule file at "' + schedulePath + '"');
	}
	return JSON.parse(<any> readFileSync(schedulePath) as string);
};

export const setSchedule = (program: Program) => {
	writeFileSync(schedulePath, JSON.stringify(program, null, '  '));
	callbacks.forEach((cb) => cb());
};

export const getStatus = (): Status => {
	return status;
};

const callbacks: any = [];
export const onScheduleChanged = (cb) => {
	callbacks.push(cb);
};
