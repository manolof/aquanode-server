import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';
import { ScheduleItem } from '../../../schedule/schedule.model';
import { IAppState } from '../reducers';
import * as action from './actions';

@Injectable()
export class ScheduleService {

	constructor(private http: HttpClient,
				private store: Store<IAppState>) {
	}

	public get schedule$(): Store<ScheduleItem[]> {
		return this.store.select('schedule');
	}

	public getSchedule(): Observable<ScheduleItem[]> {
		return this.http.get<ScheduleItem[]>(`${environment.endpoint}/schedule`);
	}

	public getScheduleDispatch$(): void {
		this.store.dispatch(new action.GetScheduleAction());
	}

	public setSchedule(body: ScheduleItem[]): Observable<ScheduleItem[]> {
		return this.http.post<ScheduleItem[]>(`${environment.endpoint}/schedule`, body);
	}

	public setScheduleDispatch$(body: ScheduleItem[]): void {
		this.store.dispatch(new action.SetScheduleAction(body));
	}
}
