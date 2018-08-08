import { Schedule } from '../src/interfaces';
import { LightsStatus } from '../src/lights/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: {
			hour: 0,
			minute: 1
		},
		state: LightsStatus.night,
	},
	{
		time: {
			hour: 7,
			minute: 0
		},
		state: LightsStatus.day,
	},
	{
		time: {
			hour: 17,
			minute: 0
		},
		state: LightsStatus.night,
	},
];

export const relaySchedule: Schedule[] = [
	{
		time: {
			hour: 7,
			minute: 0
		},
		state: RelayStatus.on,
	},
	{
		time: {
			hour: 16,
			minute: 30
		},
		state: RelayStatus.off,
	},
];
