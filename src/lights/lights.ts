/* tslint:disable */
const pigpio = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ?
	require('pigpio-mock') :
	require('pigpio');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import { logger } from '../logger';
import { Fade, LightsStatus } from './interfaces';
import status from './status';

export class Lights {
	public static setState(state: LightsStatus) {
		const lights = new Lights();

		switch (state) {
			case LightsStatus.day:
				lights.setDay();
				break;
			case LightsStatus.night:
				lights.setNight();
				break;
			default:
				logger.error(`A light change was requested for an invalid state ${state}.
				Must be one of ${LightsStatus.day}, or ${LightsStatus.night}`);
		}
	}

	public static shutdown() {
		logger.info('Shutting the lights down, cleanup running');

		try {
			pigpio.terminate();
		}
		catch (e) {
			// fails on dev, since `pigpio`'s prototype doesn't contain `terminate()`
			logger.warn(e);
		}

		process.exit(0);
	}

	private static instance: Lights;
	private count = 0;
	private interval: Interval;
	private options;

	constructor() {
		this.options = {
			fadeDuration: CONFIG.fadeDuration,
			rgbSpectrum: CONFIG.rgbSpectrum,
			colorRange: 300,
			start: 0,
			end: 255,
			whiteLED: new Gpio(CONFIG.pins.white, { mode: Gpio.OUTPUT }),
			rgbLEDs: {
				red: new Gpio(CONFIG.pins.red, { mode: Gpio.OUTPUT }),
				green: new Gpio(CONFIG.pins.green, { mode: Gpio.OUTPUT }),
				blue: new Gpio(CONFIG.pins.blue, { mode: Gpio.OUTPUT }),
			},
		};

		if (!Lights.instance) {
			Lights.instance = this;
		}

		return Lights.instance;
	}

	private get colorFrame(): number {
		return Math.floor(this.count * (this.options.colorRange / this.options.end));
	}

	private get whiteFrame(): number {
		return Math.floor(this.count);
	}

	private get framerate(): number {
		return Math.floor(this.options.fadeDuration / this.options.end);
	}

	private get difference(): number {
		return ((this.options.end - this.options.start) * this.framerate) / this.options.fadeDuration;
	}

	private setDay() {
		status.set(LightsStatus.day);
		this.fade(Fade.in);
	}

	private setNight() {
		status.set(LightsStatus.night);
		this.fade(Fade.out);
	}

	private fade(mode: Fade) {
		this.stop();

		this.interval = new Interval(
			() => {
				this.calculateRate.bind(this, mode)();
				this.setWhiteLED();
				this.setRgbLED();
			},
			this.framerate,
		);
		this.interval.start();
	}

	private stop() {
		if (this.interval instanceof Interval) {
			this.interval.stop();
		}
	}

	private calculateRate(mode: Fade): void {
		if (mode === Fade.in) {
			if (this.count <= this.options.end - 1) {
				this.count += this.difference;
			}
			else {
				this.stop();
				return;
			}
		}
		else {
			if (this.count > this.options.start) {
				this.count -= this.difference;
			}
			else {
				this.stop();
				return;
			}
		}

		if (this.count > this.options.end) {
			this.count = this.options.end;
		}
		else if (this.count < this.options.start) {
			this.count = this.options.start;
		}

		return;
	}

	private setRgbLED() {
		Object.keys(this.options.rgbLEDs)
			.map((led) => {
				this.options.rgbLEDs[led]
					.pwmWrite(this.options.rgbSpectrum[led][this.colorFrame]);
			});
	}

	private setWhiteLED() {
		this.options.whiteLED.pwmWrite(this.whiteFrame);
	}
}

process.on('SIGHUP', Lights.shutdown);
process.on('SIGINT', Lights.shutdown);
process.on('SIGCONT', Lights.shutdown);
process.on('SIGTERM', Lights.shutdown);
