import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../../../environments/environment';
import { Status } from '../../../status/status.model';
import { IAppState } from '../reducers';
import * as action from './actions';

@Injectable()
export class StatusService {

	constructor(private http: HttpClient,
				private store: Store<IAppState>) {
	}

	public get status$(): Store<Status> {
		return this.store.select('status');
	}

	public statusDispatch$(): void {
		this.store.dispatch(new action.GetStatusAction());
	}

	public getStatus(): Observable<Status> {
		return this.http.get<Status>(`${environment.endpoint}/status`);
	}
}
