const fs = require('fs');
const path = require('path');
let schedulePath;
let schedule;
const status = {
	state: 'off'
};

let config;
exports.getConfig = function getConfig() {
	return config;
};

exports.setConfig = function setConfig(contents) {
	config = contents;
	schedulePath = path.resolve(path.dirname(config.configPath), config.schedule);
	if (!path.isAbsolute(schedulePath)) {
		schedulePath = path.join(path.dirname(config.configPath), schedulePath);
	}
	if (!fs.existsSync(schedulePath)) {
		throw new Error('Could not find a schedule file at "' + schedulePath + '"');
	}
	schedule = fs.readFileSync(schedulePath);
	schedule = JSON.parse(schedule);
};

exports.getSchedule = function getSchedule() {
	return schedule;
};

exports.setSchedule = function setSchedule(newSchedule) {
	schedule = newSchedule;
	fs.writeFileSync(schedulePath, JSON.stringify(schedule, null, '  '));
	callbacks.forEach(function(cb) {
		cb();
	});
};

exports.getStatus = function getStatus() {
	return status;
};

const callbacks = [];
exports.onScheduleChanged = function onScheduleChanged(cb) {
	callbacks.push(cb);
};
