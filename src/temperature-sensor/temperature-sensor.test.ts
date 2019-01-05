import * as sensor from 'ds18b20';

import { CONFIG } from '../../conf/config';
import { temperatureLogCollection } from '../../conf/firebase';
import { Interval } from '../interval';
import { logger } from '../logger';
import status from './status';
import { TemperatureSensor } from './temperature-sensor';

jest.useFakeTimers();

jest.mock('../../conf/config', () => ({
	CONFIG: {
		temperatureSensorInterval: 500,
		logsPath: 'log.log',
	},
}));
jest.mock('../../conf/firebase', () => ({
	temperatureLogCollection: {
		add: jest.fn(),
	},
}));
jest.mock('../logger');
jest.mock('./status');

describe('TemperatureSensor', () => {
	const intervalStart = jest.spyOn(Interval.prototype, 'start');
	const loggerError = jest.spyOn(logger, 'error');
	const statusSet = jest.spyOn(status, 'set');
	const temperatureLogCollectionAdd = jest.spyOn(temperatureLogCollection, 'add');
	const originalProcessEnv = process.env;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	describe('init', () => {
		it(`should start recording the temperature at a set interval, if in production`, () => {
			process.env = {
				...originalProcessEnv,
				NODE_ENV: 'production',
			};

			TemperatureSensor.init();
			expect(statusSet).toHaveBeenCalledTimes(1);
			expect(statusSet).toHaveBeenCalledWith('42');

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			process.env = originalProcessEnv;

			expect(loggerError).not.toHaveBeenCalled();
			expect(intervalStart).toHaveBeenCalledTimes(1);
			expect(statusSet).toHaveBeenCalledTimes(2);
			expect(temperatureLogCollectionAdd).toHaveBeenCalledWith({
				temperature: 42,
				date: expect.any(Date),
			});
		});

		it(`should not start recording the temperature, if not in production`, () => {
			TemperatureSensor.init();

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			expect(loggerError).not.toHaveBeenCalled();
			expect(intervalStart).toHaveBeenCalledTimes(1);
			expect(temperatureLogCollectionAdd).not.toHaveBeenCalled();
		});

		it(`should log an error if there is a sensor error`, () => {
			sensor._setMockError(new Error());

			TemperatureSensor.init();

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			expect(loggerError).toHaveBeenCalledTimes(1);
			expect(intervalStart).not.toHaveBeenCalledTimes(1);
			expect(temperatureLogCollectionAdd).not.toHaveBeenCalled();

			sensor._setMockError(null);
		});

		it(`should log an error if there are not any sensors found`, () => {
			sensor._setMockIds([]);

			TemperatureSensor.init();

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			expect(loggerError).toHaveBeenCalledTimes(1);
			expect(intervalStart).not.toHaveBeenCalledTimes(1);
			expect(temperatureLogCollectionAdd).not.toHaveBeenCalled();
		});

		it(`should log an error if there are more than one sensors connected`, () => {
			sensor._setMockIds(['id1', 'id2']);

			TemperatureSensor.init();

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			expect(loggerError).toHaveBeenCalledTimes(1);
			expect(intervalStart).not.toHaveBeenCalledTimes(1);
			expect(temperatureLogCollectionAdd).not.toHaveBeenCalled();
		});
	});

});
