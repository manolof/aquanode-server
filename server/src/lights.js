const logger = require('./logger.js');
const schedule = require('./schedule.js');
const config = schedule.getConfig();

let setStateAfterInit = null;
let initialized = false;

const Gpio = require('pigpio').Gpio;
let led = new Gpio(config.pins.day, { mode: Gpio.OUTPUT });

let interval;
let count = 0;

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
			logger.error('A light change was requested for an invalid state "' + state +
				'". Must be one of "day", "night", or "off"');
	}
};

function setDay() {
	if (!initialized) {
		setStateAfterInit = 'day';
		return;
	}
	logger.info('Setting the lighting state to DAY');
	schedule.getStatus().state = 'day';

	fader(true);
}

function setNight() {
	if (!initialized) {
		setStateAfterInit = 'night';
		return;
	}
	logger.info('Setting the lighting state to NIGHT');
	schedule.getStatus().state = 'night';

	fader(false);
}

function setOff() {
	if (!initialized) {
		setStateAfterInit = 'off';
		return;
	}
	logger.info('Setting the lighting state to OFF');
	schedule.getStatus().state = 'off';

	led.pwmWrite(0);
	clearInterval(interval);
	count = 0;
}

function fader(mode) {
	clearInterval(interval);

	const start = 5;
	const end = 255;
	const duration = config.fadeDuration;
	const framerate = config.fadeFramerate;
	const toAdd = ((end - start) * framerate) / duration;

	console.log('toAdd', toAdd);
	interval = setInterval(function() {
		if (mode) {
			if (count <= end - 1) {
				count += toAdd;
			}
			else {
				clearInterval(interval);
				return;
			}
		} else {
			if (count > start) {
				count -= toAdd;
			}
			else {
				clearInterval(interval);
				return;
			}
		}

		if (count > end) {
			count = end;
		}
		else if (count < start) {
			count = start;
		}

		console.log('count', count);
		led.pwmWrite(Math.floor(count));
	}, framerate);
}
