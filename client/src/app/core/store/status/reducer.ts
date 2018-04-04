import { Status } from '../../../status/status.model';
import * as _action from './actions';

interface State extends Status {
	loading: boolean;
}

export const initialStatusState: State = {
	loading: true,
	time: null,
	state: 'day',
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
