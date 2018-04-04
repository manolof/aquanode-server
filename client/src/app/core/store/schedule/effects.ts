import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { ScheduleItem } from '../../../schedule/schedule.model';
import * as action from './actions';
import { ScheduleService } from './service';

@Injectable()
export class ScheduleEffects {
	@Effect()
	public get$: Observable<any> = this.actions$
		.ofType(action.GET_SCHEDULE)
		.pipe(
			switchMap(() => this.scheduleService.getSchedule()),
			mergeMap((res: ScheduleItem[]) =>
				of(
					new action.GetScheduleSuccessAction(res),
				),
			),
			catchError((err: Error) =>
				of(
					new action.GetScheduleFailAction(err),
				),
			)
		);

	@Effect()
	public set$: Observable<any> = this.actions$
		.ofType(action.SET_SCHEDULE)
		.pipe(
			map((_action: action.SetScheduleAction) => _action.payload),
			switchMap((res: ScheduleItem[]) => this.scheduleService.setSchedule(res)),
			mergeMap((res: ScheduleItem[]) =>
				// this.openSnackBar(`Success - Mode: ${res.mode}, State: ${res.overrideState}`);
				of(
					new action.SetScheduleSuccessAction(res),
				),
			),
			catchError((err: Error) =>
				of(
					new action.SetScheduleFailAction(err),
				),
			),
		);

	constructor(private actions$: Actions,
				private scheduleService: ScheduleService,
				/*private snackBar: MatSnackBar*/) {
	}

	// private openSnackBar(message: string) {
	// 	this.snackBar.open(message, 'Dismiss', {
	// 		duration: 1000,
	// 	});
	// }
}
