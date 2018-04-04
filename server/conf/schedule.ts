import { Schedule } from '../src/interfaces';
import { LightsStatus } from '../src/lights/interfaces';
import { SolenoidStatus } from '../src/solenoid/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: {
			hour: 7,
			minute: 0
		},
		state: LightsStatus.day,
	},
	{
		time: {
			hour: 16,
			minute: 0
		},
		state: LightsStatus.night,
	},
	// {
	// 	time: {
	// 		hour: 0,
	// 		minute: 1
	// 	},
	// 	state: LightsStatus.off,
	// },
];

export const solenoidSchedule: Schedule[] = [
	{
		time: {
			hour: 7,
			minute: 0
		},
		state: SolenoidStatus.on,
	},
	{
		time: {
			hour: 16,
			minute: 30
		},
		state: SolenoidStatus.off,
	},
];
