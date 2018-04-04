import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MatSnackBar } from '@angular/material';
import { ScheduleItem } from '../../../schedule/schedule.model';
import * as action from './actions';
import { ScheduleService } from './service';

@Injectable()
export class ScheduleEffects {
	@Effect()
	public get$: Observable<any> = this.actions$
		.ofType(action.GET_SCHEDULE)
		.switchMap(() => this.scheduleService.getSchedule())
		.mergeMap((res: ScheduleItem[]) => {
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
		.map((_action: action.SetScheduleAction) => _action.payload)
		.switchMap((res: ScheduleItem[]) => this.scheduleService.setSchedule(res))
		.mergeMap((res: ScheduleItem[]) => {
			// this.openSnackBar(`Success - Mode: ${res.mode}, State: ${res.overrideState}`);
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
				private snackBar: MatSnackBar) {
	}

	private openSnackBar(message: string) {
		this.snackBar.open(message, 'Dismiss', {
			duration: 1000,
		});
	}
}
