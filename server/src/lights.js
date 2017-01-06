const logger = require('./logger.js');
const schedule = require('./schedule.js');
// var raspi = require('raspi');
// var gpio = require('raspi-gpio');
// var config = schedule.getConfig();

let setStateAfterInit = null;
let initialized = false;
// var dayPin = null;
// var nightPin = null;

// raspi.init(function() {
// 	dayPin = new gpio.DigitalOutput(config.pins.day);
// 	nightPin = new gpio.DigitalOutput(config.pins.night);
	initialized = true;
// 	if (setStateAfterInit) {
// 		exports.setState(setStateAfterInit);
// 	}
// });

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
	logger.info('Setting the lighting state to day');
	schedule.getStatus().state = 'day';
	logger.info('DAY!');
	// dayPin.write(gpio.HIGH);
	// nightPin.write(gpio.LOW);
}

function setNight() {
	if (!initialized) {
		setStateAfterInit = 'night';
		return;
	}
	logger.info('Setting the lighting state to night');
	schedule.getStatus().state = 'night';
	logger.info('NIGHT!');
	// dayPin.write(gpio.LOW);
	// nightPin.write(gpio.HIGH);
}

function setOff() {
	if (!initialized) {
		setStateAfterInit = 'off';
		return;
	}
	logger.info('Setting the lighting state to off');
	schedule.getStatus().state = 'off';
	logger.info('OFF!');
	// dayPin.write(gpio.LOW);
	// nightPin.write(gpio.LOW);
}
