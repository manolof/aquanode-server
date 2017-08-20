import * as _action from './actions';
import { Status } from '../../../status/status.model';

interface State extends Status {
	loading: boolean;
}

export const initialStatusState: State = {
	loading: true,
	time: 0,
	state: 'off',
	nextTransitionTime: 0,
	nextTransitionState: 'off',
};

export function statusReducer(state: State = initialStatusState, action: _action.StatusActions): State {
	switch (action.type) {
		case _action.GET_STATUS: {
			return {
				...state,
				loading: true
			};
		}

		case _action.GET_STATUS_SUCCESS: {
			return {
				...action.payload,
				loading: false,
			};
		}

		case _action.GET_STATUS_FAIL: {
			return {
				...state,
				loading: false,
			};
		}

		default: {
			return state;
		}
	}
}
