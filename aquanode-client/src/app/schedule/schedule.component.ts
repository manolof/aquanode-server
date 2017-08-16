import { Component, OnInit, ViewChild } from '@angular/core';
import { MdButtonToggleGroup, MdTabChangeEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { ScheduleService } from '../core/store/schedule/service';
import { Schedule, ScheduleMode, ScheduleState } from './schedule.model';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
	public schedule$: Observable<Schedule>;
	@ViewChild('overrideStateGroup') public overrideStateGroup: MdButtonToggleGroup;

	constructor(private scheduleService: ScheduleService) {
	}

	public ngOnInit() {
		this.schedule$ = this.scheduleService.schedule$;
		this.scheduleService.getScheduleDispatch$();
		this.overrideStateGroup.registerOnChange(this.onStateClickChangeOverrideState);
	}

	public transformTime(time: { hour: number, minute: number }) {
		const _minute = time.minute.toString().length === 1 ? `0${time.minute}` : time.minute;
		return `${time.hour}:${_minute}`;
	}

	public onTabClickChangeMode(event: MdTabChangeEvent) {
		let schedule: Schedule;
		const tabName = event.tab.textLabel.toLowerCase();

		this.schedule$.take(1).subscribe(s => schedule = s);

		const payload: Schedule = {
			mode: tabName as ScheduleMode,
			overrideState: schedule.overrideState,
			schedule: schedule.schedule,
		};

		this.scheduleService.setScheduleDispatch$(payload);
	}

	public onStateClickChangeOverrideState = (state: ScheduleState) => {
		let schedule: Schedule;

		this.schedule$.take(1).subscribe(s => schedule = s);

		const payload: Schedule = {
			mode: schedule.mode,
			overrideState: state,
			schedule: schedule.schedule,
		};

		this.scheduleService.setScheduleDispatch$(payload);
	};
}
