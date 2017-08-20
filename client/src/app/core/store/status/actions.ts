/* tslint:disable:max-classes-per-file */

import { Action } from '@ngrx/store';
import { Status } from '../../../status/status.model';

export const GET_STATUS = 'GET_STATUS';
export const GET_STATUS_SUCCESS = 'GET_STATUS Success';
export const GET_STATUS_FAIL = 'GET_STATUS Fail';

export class GetStatusAction implements Action {
	public readonly type = GET_STATUS;
}

export class GetStatusSuccessAction implements Action {
	public readonly type = GET_STATUS_SUCCESS;

	constructor(public payload: Status) {
	}
}

export class GetStatusFailAction implements Action {
	public readonly type = GET_STATUS_FAIL;

	constructor(public payload: Error) {
	}
}

export type StatusActions =
	| GetStatusAction
	| GetStatusSuccessAction
	| GetStatusFailAction;
