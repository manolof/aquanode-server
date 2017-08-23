import { existsSync, PathLike, readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { configuration } from './config';

import { Config, Program, Status } from './interfaces';

let schedulePath: PathLike;
const status: Status = {
	state: 'off'
};
const callbacks: any = [];

export const getSchedule = (): Program => {
	const config: Config = configuration.get();

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

export const onScheduleChanged = (cb) => {
	callbacks.push(cb);
};
