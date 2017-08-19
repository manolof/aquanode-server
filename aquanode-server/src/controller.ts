import { getSchedule, getStatus, onScheduleChanged } from './schedule';
import * as lights from './lights';
import { logger } from './logger';

let scheduleTimeout = null;
let dailySchedule;

const createDate = (hours, minutes, seconds) => {
	const date = new Date();
	date.setHours(hours);
	date.setMinutes(minutes);
	date.setSeconds(seconds);
	return date;
};

const scheduleMidnightReset = () => {
	const midnightDate = new Date(createDate(0, 0, 0).getTime() + 24 * 60 * 60 * 1000);
	const status = getStatus();
	status.nextTransitionTime = midnightDate.getTime();
	status.nextTransitionState = 'midnight reschedule';
	logger.info('Scheduling the daily schedule preparation for ' + midnightDate);
	scheduleTimeout = setTimeout(setSchedule, midnightDate.getTime() - Date.now());
};

const scheduleNextTransition = () => {
	const nextScheduleEntry = dailySchedule.shift();
	const currentStatus = getStatus();
	logger.info('Scheduling the next transition from ' + currentStatus.state +
		' to ' + nextScheduleEntry.state + ' for ' + nextScheduleEntry.date);
	const status = getStatus();
	status.nextTransitionTime = nextScheduleEntry.date.getTime();
	status.nextTransitionState = nextScheduleEntry.state;
	setTimeout(() => {
		lights.setState(nextScheduleEntry.state);
		if (dailySchedule.length) {
			scheduleNextTransition();
		}
		else {
			scheduleMidnightReset();
		}
	}, nextScheduleEntry.date.getTime() - Date.now());
};

const setSchedule = () => {

	const currentSchedule = getSchedule();

	// Cancel the previous schedule, if it was running
	if (scheduleTimeout) {
		clearTimeout(scheduleTimeout);
		scheduleTimeout = null;
	}

	// If we're in override mode, set that mode and exit early
	if (currentSchedule.mode === 'override') {
		logger.info('Setting the override mode and skipping daily schedule creation');
		lights.setState(currentSchedule.overrideState);
		return;
	}
	logger.info('Creating the daily schedule');

	// Calculate the daily schedule
	let entries = currentSchedule.schedule.map((entry) => {
		return {
			date: createDate(entry.time.hour, entry.time.minute, 0),
			state: entry.state,
			name: entry.name,
		};
	});

	// Remove any events that occur after the next event, e.g. sunset is late enough that
	// it would occur after a manual time event due to time of year
	entries = entries.filter((entry, i) => {
		if (i === entries.length - 1) {
			return true;
		}
		const isValid = entry.date.getTime() < entries[i + 1].date.getTime();
		if (!isValid) {
			logger.warn('Entry ' + entry.name + ' occurs after the next entry and will be ignored');
		}
		return isValid;
	});

	// Add an entry at the beginning of the day, e.g. 00:00:00, to kickstart the lights
	entries.unshift({
		date: createDate(0, 0, 0),
		state: entries[entries.length - 1].state,
		name: 'Initial state'
	});

	// Find the most recent schedule in the past to set the current lighting state
	// We set a 1 second buffer so that we don't miss anything while processing
	const currentTime = Date.now();
	const currentEntry = entries.filter((entry) => {
		return entry.date.getTime() <= currentTime + 1000;
	}).pop();

	if (!currentEntry) {
		throw new Error('Internal error: could not find current entry');
	}
	lights.setState(currentEntry.state);

	// Remove the entries that are in the past, using the 1 second buffer as above
	entries = entries.filter((entry) => {
		return entry.date.getTime() > currentTime + 1000;
	});

	// Store the entries to the global state for use by scheduleNextTransition
	dailySchedule = entries;
	logger.info('The daily schedule is as follows: ');

	entries.forEach((entry) => {
		logger.info('  ' + entry.state + ': ' + entry.date);
	});

	// If there are no entries left, we are done with the schedule for today and just
	// need to wait until tomorrow to do it again
	if (!entries.length) {
		scheduleMidnightReset();
	}
	else {
		scheduleNextTransition();
	}
};

onScheduleChanged(setSchedule);
setSchedule();
