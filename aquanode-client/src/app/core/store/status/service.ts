import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { IAppState } from '../reducers';
import * as action from './actions';
import { Status } from '../../../status/status.model';

@Injectable()
export class StatusService {

	constructor(private http: Http,
				private store: Store<IAppState>) {
	}

	public get status$(): Store<Status> {
		return this.store.select('status');
	}

	public statusDispatch$(): void {
		this.store.dispatch(new action.GetStatusAction);
	}

	public getStatus(): Observable<Status> {
		return this.http.get(`http://127.0.0.1:3000/api/status`)
			.map((res: Response) => res.json());
	}
}
