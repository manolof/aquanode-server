import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import * as action from './actions';
import { ScheduleService } from './service';
import { Schedule } from '../../../schedule/schedule.model';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class ScheduleEffects {
	@Effect()
	public get$: Observable<any> = this.actions$
		.ofType(action.GET_SCHEDULE)
		.switchMap(() => this.scheduleService.getSchedule())
		.mergeMap((res: Schedule) => {
			return of(
				new action.GetScheduleSuccessAction(res),
			);
		})
		.catch((err: Error) =>
			of(
				new action.GetScheduleFailAction(err),
			),
		);

	@Effect()
	public set$: Observable<any> = this.actions$
		.ofType(action.SET_SCHEDULE)
		.map((action: action.SetScheduleAction) => action.payload)
		.switchMap((res) => this.scheduleService.setSchedule(res))
		.mergeMap((res: Schedule) => {
			this.openSnackBar(`Success - Mode: ${res.mode}, State: ${res.overrideState}`);
			return of(
				new action.SetScheduleSuccessAction(res),
			);
		})
		.catch((err: Error) =>
			of(
				new action.SetScheduleFailAction(err),
			),
		);

	constructor(private actions$: Actions,
				private scheduleService: ScheduleService,
				private snackBar: MdSnackBar) {
	}

	private openSnackBar(message: string) {
		this.snackBar.open(message, 'Dismiss', {
			duration: 1000,
		});
	}
}
