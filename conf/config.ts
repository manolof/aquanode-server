import { Config } from '../src/interfaces';

export const CONFIG: Config = {
	port: 3003,
	pins: {
		red: 17,
		green: 27,
		blue: 22,
		white: 18,
		relay: 23,
	},
	fadeInterval: 5000,
	temperatureSensorInterval: 600000,
	socketEmitInterval: 1000,
	logsPath: 'logs/',
};
