import { ActionReducerMap } from '@ngrx/store';

import { statusReducer } from './status/reducer';
import { scheduleReducer } from './schedule/reducer';

import { Status } from '../../status/status.model';

export interface IAppState {
	status: Status;
	schedule: any;
}

export const reducers: ActionReducerMap<IAppState> = {
	status: statusReducer,
	schedule: scheduleReducer,
};
