import { Config } from './interfaces';

export const configuration = {
	_config: {},
	get(): Config {
		return this._config;
	},
	set(value: Config) {
		this._config = value;
	},
};
