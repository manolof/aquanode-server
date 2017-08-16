import * as _action from './actions';
import { Schedule } from '../../../schedule/schedule.model';

interface State extends Schedule {
	loading: boolean;
}

export const initialScheduleState: State = {
	loading: true,
	mode: 'override',
	overrideState: 'off',
	schedule: [],
};

export function scheduleReducer(state: State = initialScheduleState, action: _action.ScheduleActions): State {
	switch (action.type) {
		case _action.GET_SCHEDULE: {
			return {
				...state,
				loading: true
			}
		}

		case _action.GET_SCHEDULE_SUCCESS: {
			return {
				...action.payload,
				loading: false,
			};
		}

		case _action.GET_SCHEDULE_FAIL: {
			return {
				...state,
				loading: false,
			};
		}

		case _action.SET_SCHEDULE: {
			return {
				...action.payload,
				loading: true
			}
		}

		case _action.SET_SCHEDULE_SUCCESS: {
			return {
				...action.payload,
				loading: false,
			};
		}

		case _action.SET_SCHEDULE_FAIL: {
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
