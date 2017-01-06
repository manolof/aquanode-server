import dispatcher from 'dispatcher';
import actions from 'actions';

export function createScheduleUpdatedAction(schedule) {
	dispatcher.dispatch({
		actionType: actions.SCHEDULE_UPDATED,
		schedule
	});
}

export function createModeChangedAction(mode) {
	dispatcher.dispatch({
		actionType: actions.MODE_CHANGED,
		mode
	});
}

export function createOverrideStateChangedAction(state) {
	dispatcher.dispatch({
		actionType: actions.OVERRIDE_STATE_CHANGED,
		state
	});
}

export function createEntryStateChangedAction(state, entryId) {
	dispatcher.dispatch({
		actionType: actions.MODE_CHANGED,
		mode
	});
}
