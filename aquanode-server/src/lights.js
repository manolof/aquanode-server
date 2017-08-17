const logger = require('./logger');
const schedule = require('./schedule');
const pigpio = require('pigpio');

const config = schedule.getConfig();

let setStateAfterInit = null;
let initialized = false;

const Gpio = pigpio.Gpio;

initialized = true;

if (setStateAfterInit) {
	exports.setState(setStateAfterInit);
}

exports.setState = function setState(state) {
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

const Lights = {
	count: 0,

	options: {
		fadeDuration: config.fadeDuration,
		rgbSpectrum: config.rgbSpectrum,
		colorRange: 299,
		start: config.luminosity.start,
		end: config.luminosity.end,
		whiteLED: new Gpio(config.pins.white, { mode: Gpio.OUTPUT }),
		rgbLEDs: {
			red: new Gpio(config.pins.red, { mode: Gpio.OUTPUT }),
			green: new Gpio(config.pins.green, { mode: Gpio.OUTPUT }),
			blue: new Gpio(config.pins.blue, { mode: Gpio.OUTPUT }),
		},
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
		this.options.whiteLED.pwmWrite(0);

		Object.keys(this.options.rgbLEDs)
			.map((led) => {
				this.options.rgbLEDs[led].pwmWrite(0);
			});

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
		Object.keys(this.options.rgbLEDs)
			.map((led, i) => {
				this.options.rgbLEDs[led]
					.pwmWrite(this.options.rgbSpectrum[led][this.options.colorFrame]);
			});
	},

	setWhiteLED() {
		this.options.whiteLED.pwmWrite(this.options.whiteFrame);
	},
};

function setDay() {
	if (!initialized) {
		setStateAfterInit = 'day';
		return;
	}
	logger.info('Setting the lighting state to DAY');
	schedule.getStatus().state = 'day';

	Lights.stop();
	Lights.fader(true);
}

function setNight() {
	if (!initialized) {
		setStateAfterInit = 'night';
		return;
	}
	logger.info('Setting the lighting state to NIGHT');
	schedule.getStatus().state = 'night';

	Lights.stop();
	Lights.fader(false);
}

function setOff() {
	if (!initialized) {
		setStateAfterInit = 'off';
		return;
	}
	logger.info('Setting the lighting state to OFF');
	schedule.getStatus().state = 'off';

	Lights.stop();
	Lights.off();
}

function Interval(fn, time) {
	let timer = false;

	this.start = () => {
		if (!this.isRunning()) {
			timer = setInterval(fn, time);
		}
	};

	this.stop = () => {
		clearInterval(timer);
		timer = false;
	};
	this.isRunning = () => {
		return timer !== false;
	};
}
