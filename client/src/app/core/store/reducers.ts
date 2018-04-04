import { ActionReducerMap } from '@ngrx/store';

import { scheduleReducer } from './schedule/reducer';
import { statusReducer } from './status/reducer';

import { Status } from '../../status/status.model';

export interface IAppState {
	status: Status;
	schedule: any;
}

export const reducers: ActionReducerMap<IAppState> = {
	status: statusReducer,
	schedule: scheduleReducer,
};
