/* tslint:disable */
/* istanbul ignore next */
const pigpio = process.env.NODE_ENV === 'development' ? require('pigpio-mock') : require('pigpio');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import { logger } from '../logger';
import { LightsStatus } from './interfaces';
import status from './status';

export class Lights {
	private intervals: { red?: Interval; green?: Interval; blue?: Interval; white?: Interval } = {};
	private options;
	private currentLedValues: { red: number; green: number; blue: number; white: number } = {
		red: 0,
		green: 0,
		blue: 0,
		white: 0,
	};

	constructor() {
		this.options = {
			fadeInterval: CONFIG.fadeInterval,
			leds: {
				red: new Gpio(CONFIG.pins.red, { mode: Gpio.OUTPUT }),
				green: new Gpio(CONFIG.pins.green, { mode: Gpio.OUTPUT }),
				blue: new Gpio(CONFIG.pins.blue, { mode: Gpio.OUTPUT }),
				white: new Gpio(CONFIG.pins.white, { mode: Gpio.OUTPUT }),
			},
		};
	}

	public setState(state: LightsStatus): void {
		this.setLights(state);
	}

	private setLights(state: LightsStatus): void {
		const { red, green, blue, white } = state;
		status.set(`R: ${red}, G: ${green}, B: ${blue}, W: ${white}`);
		this.fade(state);
	}

	private fade(state: LightsStatus): void {
		this.stopAll();

		Object.keys(this.options.leds).forEach(led => {
			const ledInstance = this.options.leds[led];
			this.intervals[led] = new Interval(() => {
				const newValue = +state[led];
				const currValue = this.currentLedValues[led];
				let val = 0;

				if (currValue === newValue) {
					val = currValue;
					this.stop(led);
				} else if (currValue < newValue) {
					val = currValue + 1;
					ledInstance.pwmWrite(val);
				} else if (currValue > newValue) {
					val = currValue - 1;
					ledInstance.pwmWrite(val);
				}
				this.currentLedValues[led] = val;
			}, this.options.fadeInterval);
			this.intervals[led].start();
		});
	}

	private stopAll(): void {
		Object.keys(this.intervals).forEach((led: string) => this.stop(led));
	}

	private stop(led: string): void {
		if (this.intervals[led] instanceof Interval) {
			this.intervals[led].stop();
		}
	}
	public static shutdown(): void {
		logger.info('Shutting the lights down, cleanup running');

		try {
			pigpio.terminate();
		} catch (e) {
			// fails on dev, since `pigpio`'s prototype doesn't contain `terminate()`
			logger.warn(e);
		}

		process.exit(0);
	}
}

process.on('SIGHUP', Lights.shutdown);
process.on('SIGINT', Lights.shutdown);
process.on('SIGCONT', Lights.shutdown);
process.on('SIGTERM', Lights.shutdown);
