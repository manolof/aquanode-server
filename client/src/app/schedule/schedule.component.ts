import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';

import { ScheduleService } from '../core/store/schedule/service';
import { ScheduleItem } from './schedule.model';
import { pluck } from 'rxjs/operators';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
	public schedule$: Observable<ScheduleItem[]>;

	// @ViewChild('overrideStateGroup') public overrideStateGroup: MatButtonToggleGroup;

	constructor(private scheduleService: ScheduleService) {
	}

	public ngOnInit() {
		this.schedule$ = this.scheduleService.schedule$;
		this.scheduleService.getScheduleDispatch$();
		// this.overrideStateGroup.registerOnChange(this.onStateClickChangeOverrideState);
	}

	public get isLoading$(): Observable<boolean> {
		return this.scheduleService.schedule$.pipe(pluck('loading'));
	}

	// public transformTime(time: { hour: number, minute: number }) {
	// 	const _minute = time.minute.toString().length === 1 ? `0${time.minute}` : time.minute;
	// 	return `${time.hour}:${_minute}`;
	// }

	// public onTabClickChangeMode(event: MatTabChangeEvent) {
	// 	let schedule: Schedule;
	// 	const tabName = event.tab.textLabel.toLowerCase();
	//
	// 	this.schedule$.take(1).subscribe((s: Schedule) => schedule = s);
	//
	// 	const payload: Schedule = {
	// 		mode: tabName as ScheduleMode,
	// 		overrideState: schedule.overrideState,
	// 		schedule: schedule.schedule,
	// 	};
	//
	// 	this.scheduleService.setScheduleDispatch$(payload);
	// }

	// public onStateClickChangeOverrideState = (state: ScheduleState) => {
	// 	let schedule: Schedule;
	//
	// 	this.schedule$.take(1).subscribe((s: Schedule) => schedule = s);
	//
	// 	const payload: Schedule = {
	// 		mode: schedule.mode,
	// 		overrideState: state,
	// 		schedule: schedule.schedule,
	// 	};
	//
	// 	this.scheduleService.setScheduleDispatch$(payload);
	// }
}
