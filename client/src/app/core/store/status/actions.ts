/* tslint:disable:max-classes-per-file */

import { Action } from '@ngrx/store';
import { Status } from '../../../status/status.model';

export const GET_STATUS = '[Status] Get';
export const GET_STATUS_SUCCESS = '[Status] Get Success';
export const GET_STATUS_FAIL = '[Status] Get Fail';

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
