import { logger } from './logger';
import { getConfig, getStatus } from './schedule';

const config = getConfig();

let setStateAfterInit = null;
let initialized = false;

// const Gpio = pigpio.Gpio;

initialized = true;

export const setState = (state) => {
	switch (state) {
		case 'day':
			setDay();
			break;
		case 'night':
			setNight();
			break;
		case 'off':
			setOff();
			break;
		default:
			logger.error(`A light change was requested for an invalid state ${state}. 
				Must be one of "day", "night", or "off"`);
	}
};

if (setStateAfterInit) {
	setState(setStateAfterInit);
}

const Lights = {
	count: 0,

	options: {
		fadeDuration: config.fadeDuration,
		rgbSpectrum: config.rgbSpectrum,
		colorRange: 299,
		start: config.luminosity.start,
		end: config.luminosity.end,
		// whiteLED: new Gpio(config.pins.white, { mode: Gpio.OUTPUT }),
		// rgbLEDs: {
		// 	red: new Gpio(config.pins.red, { mode: Gpio.OUTPUT }),
		// 	green: new Gpio(config.pins.green, { mode: Gpio.OUTPUT }),
		// 	blue: new Gpio(config.pins.blue, { mode: Gpio.OUTPUT }),
		// },
		get colorFrame() {
			return Math.floor(Lights.count * (this.colorRange / this.end));
		},
		get whiteFrame() {
			return Math.floor(Lights.count);
		},
		get framerate() {
			return Math.floor(this.fadeDuration / this.end);
		},
		get difference() {
			return ((this.end - this.start) * this.framerate) / this.fadeDuration;
		},
	},

	fader(mode) {
		this.interval = new Interval(this.calculateRate.bind(Lights, mode), this.options.framerate);
		this.interval.start();
	},

	stop() {
		if (this.interval instanceof Interval) {
			this.interval.stop();
		}
	},

	off() {
		// this.options.whiteLED.pwmWrite(0);

		// Object.keys(this.options.rgbLEDs)
		// 	.map((led) => {
		// 		this.options.rgbLEDs[led].pwmWrite(0);
		// 	});

		this.count = 0;
	},

	calculateRate(mode) {
		if (mode) {
			if (this.count <= this.options.end - 1) {
				this.count += this.options.difference;
			}
			else {
				this.interval.stop();
				return;
			}
		}
		else {
			if (this.count > this.options.start) {
				this.count -= this.options.difference;
			}
			else {
				this.interval.stop();
				return;
			}
		}

		if (this.count > this.options.end) {
			this.count = this.options.end;
		}
		else if (this.count < this.options.start) {
			this.count = this.options.start;
		}

		this.setWhiteLED();

		this.setRgbLED();
	},

	setRgbLED() {
		// Object.keys(this.options.rgbLEDs)
		// 	.map((led, i) => {
		// 		this.options.rgbLEDs[led]
		// 			.pwmWrite(this.options.rgbSpectrum[led][this.options.colorFrame]);
		// 	});
	},

	setWhiteLED() {
		// this.options.whiteLED.pwmWrite(this.options.whiteFrame);
	},
};

const setDay = () => {
	if (!initialized) {
		setStateAfterInit = 'day';
		return;
	}
	logger.info('Setting the lighting state to DAY');
	getStatus().state = 'day';

	Lights.stop();
	Lights.fader(true);
};

const setNight = () => {
	if (!initialized) {
		setStateAfterInit = 'night';
		return;
	}
	logger.info('Setting the lighting state to NIGHT');
	getStatus().state = 'night';

	Lights.stop();
	Lights.fader(false);
};

const setOff = () => {
	if (!initialized) {
		setStateAfterInit = 'off';
		return;
	}
	logger.info('Setting the lighting state to OFF');
	getStatus().state = 'off';

	Lights.stop();
	Lights.off();
};

class Interval {
	private fn: Function;
	private time: number;
	private timer: boolean | any;

	constructor(fn, time) {
		this.fn = fn;
		this.time = time;
		this.timer = false;
	}

	start() {
		if (!this.isRunning) {
			this.timer = setInterval(this.fn, this.time);
		}
	};

	stop() {
		clearInterval(this.timer);
		this.timer = false;
	};

	get isRunning(): boolean {
		return this.timer !== false;
	};
}
