import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { Status } from '../../../status/status.model';
import * as action from './actions';
import { StatusService } from './service';

@Injectable()
export class StatusEffects {
	@Effect()
	public get$: Observable<any> = this.actions$
		.ofType(action.GET_STATUS)
		.pipe(
			switchMap(() => this.statusService.getStatus()),
			mergeMap((res: Status) =>
				of(
					new action.GetStatusSuccessAction(res),
				),
			),
			catchError((err: Error) =>
				of(
					new action.GetStatusFailAction(err),
				),
			),
		);

	constructor(private actions$: Actions,
				private statusService: StatusService) {
	}
}
