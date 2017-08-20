import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IAppState } from '../reducers';
import * as action from './actions';
import { Schedule } from '../../../schedule/schedule.model';

@Injectable()
export class ScheduleService {

	constructor(private http: Http,
				private store: Store<IAppState>) {
	}

	public get schedule$(): Store<Schedule> {
		return this.store.select('schedule');
	}

	public getSchedule(): Observable<Schedule> {
		return this.http.get(`/api/schedule`)
			.map((res: Response) => res.json());
	}

	public getScheduleDispatch$(): void {
		this.store.dispatch(new action.GetScheduleAction());
	}

	public setSchedule(body: Schedule): Observable<Schedule> {
		return this.http.post(`/api/schedule`, body)
			.map((res: Response) => res.json());
	}

	public setScheduleDispatch$(body: Schedule): void {
		this.store.dispatch(new action.SetScheduleAction(body));
	}
}
