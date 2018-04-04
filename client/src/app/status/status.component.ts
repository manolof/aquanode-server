import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { pluck } from 'rxjs/operators';

import { StatusService } from '../core/store/status/service';
import { Status } from './status.model';

@Component({
	selector: 'app-status',
	templateUrl: './status.component.html',
	styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
	public status$: Observable<Status>;

	constructor(private statusService: StatusService) {
	}

	public get isLoading$(): Observable<boolean> {
		return this.statusService.status$.pipe(pluck('loading'));
	}

	public ngOnInit() {
		this.status$ = this.statusService.status$;

		setInterval(() => this.statusService.statusDispatch$(), 1000);
	}
}
