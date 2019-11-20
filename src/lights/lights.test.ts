// @ts-ignore
import * as pigpio from 'pigpio';
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import { logger } from '../logger';
import { LightsStatus } from './interfaces';
import { Lights } from './lights';
import status from './status';

jest.useFakeTimers();

jest.mock('../../conf/config', () => ({
	CONFIG: {
		pins: {
			white: 1,
			red: 2,
			green: 3,
			blue: 4,
			relay: 5,
		},
		fadeInterval: 500,
		logsPath: 'log.log',
	},
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
			const state: LightsStatus = { red: 1, green: 1, blue: 1 };
			instance.setState(state);

			expect(statusSet).toHaveBeenCalledWith(`R: ${state.red}, G: ${state.green}, B: ${state.blue}`);

			expect(intervalStop).not.toHaveBeenCalled();
			expect(gpioPwmWrite).not.toHaveBeenCalled();
			expect(intervalStart).toHaveBeenCalledTimes(3);

			jest.advanceTimersByTime(CONFIG.fadeInterval);
			expect(gpioPwmWrite.mock.calls[0][0]).toBe(1);

			// Should call stop again once it reaches zero
			jest.advanceTimersByTime(CONFIG.fadeInterval);
			expect(intervalStop).toHaveBeenCalledTimes(3);

			// Stop interval and set state again
			instance.setState(state);
			expect(intervalStop).toHaveBeenCalledTimes(6);
			expect(gpioPwmWrite).toHaveBeenCalledTimes(3);
			expect(intervalStart).toHaveBeenCalledTimes(6);
		});
	});

	describe('shutdown', () => {
		const loggerInfo = jest.spyOn(logger, 'info');
		const loggerWarn = jest.spyOn(logger, 'warn');
		const processExit = jest.spyOn(process, 'exit').mockImplementation((_number) => _number);

		it(`should attempt to gracefully shutdown the lights`, () => {
			Lights.shutdown();

			expect(loggerInfo).toHaveBeenCalled();
			expect(loggerWarn).toHaveBeenCalled();
			expect(processExit).toHaveBeenCalled();
		});
	});

});
