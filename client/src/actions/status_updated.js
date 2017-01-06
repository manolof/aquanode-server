import dispatcher from 'dispatcher';
import actions from 'actions';

export function createStatusUpdatedAction(status) {
	dispatcher.dispatch({
		actionType: actions.STATUS_UPDATED,
		status
	});
}
