import dispatcher from 'dispatcher';
import actions from 'actions';

const callbacks = [];
const state = {
	showingEdit: false,
	showingDeleteConfirm: false,
	editEntryId: -1
};

export function registerCallback(cb) {
	callbacks.push(cb);
}

export function getData() {
	return state;
}

dispatcher.register((payload) => {
	function trigger() {
		callbacks.forEach((cb) => cb());
	}

	switch (payload.actionType) {
		case actions.REQUEST_EDIT:
			state.showingEdit = true;
			state.editEntryId = payload.entryId;
			trigger();
			break;
		case actions.SAVE_EDIT:
			state.showingEdit = false;
			trigger();
			break;
		case actions.CANCEL_EDIT:
			state.showingEdit = false;
			trigger();
			break;
		case actions.REQUEST_DELETE:
			state.showingDeleteConfirm = true;
			trigger();
			break;
		case actions.CONFIRM_DELETE:
			state.showingDeleteConfirm = false;
			trigger();
			break;
		case actions.CANCEL_DELETE:
			state.showingDeleteConfirm = false;
			trigger();
			break;
		default:
			break;
	}
});
