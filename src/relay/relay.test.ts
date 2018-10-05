/* tslint:disable */
const pigpio = require('pigpio-mock');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { logger } from '../logger';
import { RelayStatus } from './interfaces';
import { Relay } from './relay';
import status from './status';

jest.useFakeTimers();

jest.mock('../logger');
jest.mock('./status');

describe('Relay', () => {
	describe('setState', () => {
		const gpioDigitalWrite = jest.spyOn(Gpio.prototype, 'digitalWrite');
		const loggerError = jest.spyOn(logger, 'error');
		const statusSet = jest.spyOn(status, 'set');

		beforeEach(() => {
			gpioDigitalWrite.mockClear();
			loggerError.mockClear();
			statusSet.mockClear();
		});

		it(`should set the relay's state to on`, () => {
			Relay.setState(RelayStatus.on);

			expect(statusSet).toHaveBeenCalledWith(RelayStatus.on);
			expect(gpioDigitalWrite).toHaveBeenCalledWith(0);
		});

		it(`should set the relay's state to off`, () => {
			Relay.setState(RelayStatus.off);

			expect(statusSet).toHaveBeenCalledWith(RelayStatus.off);
			expect(gpioDigitalWrite).toHaveBeenCalledWith(1);
		});

		it(`should log an error if it's called with the incorrect relay state`, () => {
			Relay.setState('test' as any);

			expect(statusSet).not.toHaveBeenCalled();
			expect(gpioDigitalWrite).not.toHaveBeenCalled();

			expect(loggerError).toHaveBeenCalled();
		});
	});

	describe('shutdown', () => {
		const loggerInfo = jest.spyOn(logger, 'info');
		const loggerWarn = jest.spyOn(logger, 'warn');
		const processExit = jest.spyOn(process, 'exit').mockImplementation((_number) => _number);

		beforeEach(() => {
			loggerInfo.mockClear();
			loggerWarn.mockClear();
		});

		it(`should attempt to gracefully shutdown the relay`, () => {
			Relay.shutdown();

			expect(loggerInfo).toHaveBeenCalled();
			expect(loggerWarn).toHaveBeenCalled();
			expect(processExit).toHaveBeenCalled();
		});
	});

});
