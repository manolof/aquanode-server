import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';

import * as action from './actions';
import { StatusService } from './service';
import { Status } from '../../../status/status.model';

@Injectable()
export class StatusEffects {
	@Effect()
	public get$: Observable<any> = this.actions$
		.ofType(action.GET_STATUS)
		.switchMap(() => this.statusService.getStatus())
		.mergeMap((res: Status) =>
			Observable.of(
				new action.GetStatusSuccessAction(res),
			),
		)
		.catch((err: Error) =>
			Observable.of(
				new action.GetStatusFailAction(err),
			),
		);

	constructor(private actions$: Actions,
				private statusService: StatusService) {
	}
}
