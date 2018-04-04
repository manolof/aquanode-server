/* tslint:disable */

export class ScheduleItem {
	name: ScheduleState;
	nextRunAt: Date;
	lastRunAt: Date;
}

// export type ScheduleMode = 'program' | 'override';
export type ScheduleState = 'day' | 'night';
