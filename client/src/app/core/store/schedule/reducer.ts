import { ScheduleItem } from '../../../schedule/schedule.model';
import * as _action from './actions';

interface State { // TODO chech schedule vs status implementation
	loading: boolean;
	schedule: ScheduleItem[];
}

export const initialScheduleState: State = {
	loading: true,
	schedule: [],
};

export function scheduleReducer(state: State = initialScheduleState, action: _action.ScheduleActions): State {
	switch (action.type) {
		case _action.GET_SCHEDULE: {
			return {
				...state,
				loading: true,
			};
		}

		case _action.GET_SCHEDULE_SUCCESS: {
			return {
				loading: false,
				schedule: action.payload,
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
				loading: true,
				schedule: action.payload,
			};
		}

		case _action.SET_SCHEDULE_SUCCESS: {
			return {
				loading: false,
				schedule: action.payload,
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
