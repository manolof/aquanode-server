import dispatcher from 'dispatcher';
import actions from 'actions';

export function createRequestDeleteAction(entryId) {
	dispatcher.dispatch({
		actionType: actions.REQUEST_DELETE,
		entryId
	});
}

export function createDeleteConfirmedAction() {
	dispatcher.dispatch({
		actionType: actions.CONFIRM_DELETE
	});
}

export function createDeleteCancelledAction() {
	dispatcher.dispatch({
		actionType: actions.CANCEL_DELETE
	});
}

export function createRequestEditAction(entryId) {
	dispatcher.dispatch({
		actionType: actions.REQUEST_EDIT,
		entryId
	});
}

export function createEditSavedAction(entryId) {
	dispatcher.dispatch({
		actionType: actions.SAVE_EDIT,
		entryId
	});
}

export function createEditCancelledAction(entryId) {
	dispatcher.dispatch({
		actionType: actions.CANCEL_EDIT,
		entryId
	});
}
