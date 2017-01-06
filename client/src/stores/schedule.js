import dispatcher from 'dispatcher';
import actions from 'actions';
import { saveSchedule } from 'api';

let schedule = {};
const callbacks = [];

export function registerCallback(cb) {
	callbacks.push(cb);
}

export function getData() {
	return schedule;
}

dispatcher.register((payload) => {
	function save() {
		callbacks.forEach((cb) => cb());
		saveSchedule(schedule, () => {
			callbacks.forEach((cb) => cb());
		});
	}

	switch (payload.actionType) {
		case actions.SCHEDULE_UPDATED:
			schedule = payload.schedule;
			break;
		case actions.OVERRIDE_STATE_CHANGED:
			schedule.overrideState = payload.state;
			save();
			break;
		case actions.CONFIRM_DELETE:
			schedule.schedule.splice(payload.entryId, 1);
			save();
			break;
		case actions.MODE_CHANGED:
			schedule.mode = payload.mode;
			save();
			break;
		default:
			break;
	}
});
