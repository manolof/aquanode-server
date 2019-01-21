/* tslint:disable */
/* istanbul ignore next */
const sensor = process.env.NODE_ENV === 'development' ?
	require('../__mocks__/ds18b20.js') :
	require('ds18b20');
/* tslint:enable */

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import { logger } from '../logger';
import status from './status';

export class TemperatureSensor {
	public static init() {
		const temperatureSensor = new TemperatureSensor();

		temperatureSensor.getTemperature();
	}

	private static instance: TemperatureSensor;
	private options;

	constructor() {
		this.options = {
			temperatureSensorInterval: CONFIG.temperatureSensorInterval,
		};

		if (!TemperatureSensor.instance) {
			TemperatureSensor.instance = this;
		}

		return TemperatureSensor.instance;
	}

	private getTemperature() {
		sensor.sensors((err, ids) => {
			if (err) {
				logger.error(`Can not get sensor IDs: ${err}`);
				return;
			}

			if (ids.length === 0) {
				logger.error(`No sensors found`);
				return;
			}

			if (ids.length > 1) {
				logger.error(`Multiple 1-Wire sensors found; you should only connect one`);
				return;
			}

			const [temperatureSensorId] = ids;

			logger.debug(`Sensor ID: ${temperatureSensorId}`);

			const temperature = () => sensor.temperatureSync(temperatureSensorId);

			status.set(temperature().toString());

			new Interval(
				() => {
					this.processTemperatureReading(temperature());
				},
				this.options.temperatureSensorInterval,
			)
				.start();

		});
	}

	private processTemperatureReading(temperature: number) {
		logger.debug(`Sensor temperature: ${temperature}`);

		status.set(temperature.toString());

		if (process.env.NODE_ENV === 'production') {
			const firebase = require('../../conf/firebase');

			firebase.temperatureLogCollection.add({
				temperature,
				date: new Date(),
			});
		}
	}
}
