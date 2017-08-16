import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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

	public ngOnInit() {
		this.status$ = this.statusService.status$;

		setInterval(() => this.statusService.statusDispatch$(), 1000);
	}
}