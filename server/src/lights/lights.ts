/* tslint:disable */
const pigpio = process.env.NODE_ENV === 'development' ?
	require('pigpio-mock') :
	require('pigpio');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Switch } from '../interfaces';
import { Interval } from '../interval';
import { logger } from '../logger';
import { status } from '../status';
import { Fade, LightsStatus } from './interfaces';

export class Lights {
	public static setState(state: string) {
		const lights = new Lights();

		switch (state) {
			case LightsStatus.day:
				lights.setDay();
				break;
			case LightsStatus.night:
				lights.setNight();
				break;
			// case LightsStatus.off:
			// 	lights.setNight();
				// lights.setOff();
				// break;
			default:
				logger.error(`A light change was requested for an invalid state ${state}.
				Must be one of ${LightsStatus.day}, ${LightsStatus.night}, or ${LightsStatus.off}`);
		}
	}

	public static shutdown() {
		pigpio.terminate();
		logger.info('Shutting the lights down, cleanup running.');
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

	public setDay() {
		status.set(LightsStatus.day);
		this.fade(Fade.in);
	}

	public setNight() {
		status.set(LightsStatus.night);
		this.fade(Fade.out);
	}

	public setOff() {
		status.set(LightsStatus.off);
		this.off();
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

	private off() {
		this.stop();
		this.options.whiteLED.pwmWrite(Switch.off);

		Object.keys(this.options.rgbLEDs)
			.map((led) => {
				this.options.rgbLEDs[led]
					.pwmWrite(Switch.off);
			});

		this.count = Switch.off;
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
