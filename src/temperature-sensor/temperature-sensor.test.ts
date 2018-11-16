import * as sensor from 'ds18b20';

import { CONFIG } from '../../conf/config';
import { temperatureLogCollection } from '../../conf/firebase';
import { Interval } from '../interval';
import { logger } from '../logger';
import { TemperatureSensor } from './temperature-sensor';

jest.useFakeTimers();

jest.mock('../../conf/config', () => ({
	CONFIG: {
		temperatureSensorInterval: 500,
		logFile: 'log.log',
	},
}));
jest.mock('../../conf/firebase', () => ({
	temperatureLogCollection: {
		add: jest.fn(),
	},
}));
jest.mock('../logger');

describe('TemperatureSensor', () => {
	const intervalStart = jest.spyOn(Interval.prototype, 'start');
	const loggerError = jest.spyOn(logger, 'error');
	const temperatureLogCollectionAdd = jest.spyOn(temperatureLogCollection, 'add');

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	describe('init', () => {
		it(`should start recording the temperature at a set interval`, () => {
			TemperatureSensor.init();

			jest.advanceTimersByTime(CONFIG.temperatureSensorInterval);

			expect(loggerError).not.toHaveBeenCalled();
			expect(intervalStart).toHaveBeenCalledTimes(1);
			expect(temperatureLogCollectionAdd).not.toHaveBeenCalled(); // TODO: mock NODE_ENV and test it
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
