import dispatcher from 'dispatcher';
import actions from 'actions';

let status = {};
const callbacks = [];

export function registerCallback(cb) {
	callbacks.push(cb);
}

export function getData() {
	return status;
}

dispatcher.register((payload) => {
	switch (payload.actionType) {
		case actions.STATUS_UPDATED:
			status = payload.status;
			callbacks.forEach((cb) => cb());
			break;
		default:
			break;
	}
});