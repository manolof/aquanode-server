/* tslint:disable */

export class Schedule {
	mode: ScheduleMode;
	overrideState: ScheduleState;
	schedule: ScheduleItem[];
}

export class ScheduleItem {
	name: ScheduleName;
	type: ScheduleType;
	time: {
		hour: number,
		minute: number,
	};
	state: ScheduleState;
}

export type ScheduleMode = 'program' | 'override';
export type ScheduleState = 'day' | 'night' | 'off';
type ScheduleName = 'Sunrise' | 'Sunset' | 'Night';
type ScheduleType = 'manual';
