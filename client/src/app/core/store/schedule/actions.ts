/* tslint:disable:max-classes-per-file */

import { Action } from '@ngrx/store';
import { Schedule } from '../../../schedule/schedule.model';

export const GET_SCHEDULE = 'GET_SCHEDULE';
export const GET_SCHEDULE_SUCCESS = 'GET_SCHEDULE Success';
export const GET_SCHEDULE_FAIL = 'GET_SCHEDULE Fail';
export const SET_SCHEDULE = 'SET_SCHEDULE';
export const SET_SCHEDULE_SUCCESS = 'SET_SCHEDULE Success';
export const SET_SCHEDULE_FAIL = 'SET_SCHEDULE Fail';

export class GetScheduleAction implements Action {
	public readonly type = GET_SCHEDULE;
}

export class GetScheduleSuccessAction implements Action {
	public readonly type = GET_SCHEDULE_SUCCESS;

	constructor(public payload: Schedule) {
	}
}

export class GetScheduleFailAction implements Action {
	public readonly type = GET_SCHEDULE_FAIL;

	constructor(public payload: any) {
	}
}

export class SetScheduleAction implements Action {
	public readonly type = SET_SCHEDULE;

	constructor(public payload: Schedule) {
	}
}

export class SetScheduleSuccessAction implements Action {
	public readonly type = SET_SCHEDULE_SUCCESS;

	constructor(public payload: Schedule) {
	}
}

export class SetScheduleFailAction implements Action {
	public readonly type = SET_SCHEDULE_FAIL;

	constructor(public payload: any) {
	}
}

export type ScheduleActions =
	| GetScheduleAction
	| GetScheduleSuccessAction
	| GetScheduleFailAction
	| SetScheduleAction
	| SetScheduleSuccessAction
	| SetScheduleFailAction;
