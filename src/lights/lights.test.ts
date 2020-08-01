// @ts-ignore
import * as pigpio from 'pigpio';
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Config } from '../interfaces';
import { Interval } from '../interval';
import { logger } from '../logger';
import { LightsStatus } from './interfaces';
import { Lights } from './lights';
import status from './status';

jest.useFakeTimers();

jest.mock('../../conf/config', () => ({
	CONFIG: {
		pins: {
			red: 2,
			green: 3,
			blue: 4,
			relay: 5,
			white: 6,
		},
		fadeInterval: 500,
		logsPath: 'log.log',
	} as Partial<Config>,
}));
jest.mock('../logger');
jest.mock('./status');

describe('Lights', () => {
	let instance: Lights;

	beforeEach(() => {
		instance = new Lights();
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	describe('setState', () => {
		const intervalStart = jest.spyOn(Interval.prototype, 'start');
		const intervalStop = jest.spyOn(Interval.prototype, 'stop');
		const gpioPwmWrite = jest.spyOn(Gpio.prototype, 'pwmWrite');
		const statusSet = jest.spyOn(status, 'set');

		it(`should set the light's state`, () => {
			const state: LightsStatus = { red: 1, green: 1, blue: 1, white: 1 };
			instance.setState(state);

			expect(statusSet).toHaveBeenCalledWith(`R: ${state.red}, G: ${state.green}, B: ${state.blue}, W: ${state.white}`);

			expect(intervalStop).not.toHaveBeenCalled();
			expect(gpioPwmWrite).not.toHaveBeenCalled();
			expect(intervalStart).toHaveBeenCalledTimes(4);

			jest.advanceTimersByTime(CONFIG.fadeInterval);
			gpioPwmWrite.mock.calls[0].forEach(call => expect(call).toBe(1));

			// Should call stop again once it reaches zero
			jest.advanceTimersByTime(CONFIG.fadeInterval);
			expect(intervalStop).toHaveBeenCalledTimes(4);

			// Stop interval and set state again
			instance.setState(state);
			expect(intervalStop).toHaveBeenCalledTimes(8);
			expect(gpioPwmWrite).toHaveBeenCalledTimes(4);
			expect(intervalStart).toHaveBeenCalledTimes(8);
		});
	});

	describe('shutdown', () => {
		const loggerInfo = jest.spyOn(logger, 'info');
		const loggerWarn = jest.spyOn(logger, 'warn');
		const processExit = jest.spyOn(process, 'exit').mockImplementation(_number => _number as never);

		it(`should attempt to gracefully shutdown the lights`, () => {
			Lights.shutdown();

			expect(loggerInfo).toHaveBeenCalled();
			expect(loggerWarn).toHaveBeenCalled();
			expect(processExit).toHaveBeenCalled();
		});
	});
});
