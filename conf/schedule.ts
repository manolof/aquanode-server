import { Schedule } from '../src/interfaces';
import { LightsStatus } from '../src/lights/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: {
			hour: 0,
			minute: 0,
		},
		state: LightsStatus.off,
	},
	{
		time: {
			hour: 6,
			minute: 30,
		},
		state: LightsStatus.day,
	},
	{
		time: {
			hour: 7,
			minute: 30,
		},
		state: LightsStatus.off,
	},
	{
		time: {
			hour: 13,
			minute: 30,
		},
		state: LightsStatus.day,
	},
	{
		time: {
			hour: 16,
			minute: 0,
		},
		state: LightsStatus.night,
	},
	{
		time: {
			hour: 23,
			minute: 0,
		},
		state: LightsStatus.off,
	},
];

export const relaySchedule: Schedule[] = [
	{
		time: {
			hour: 0,
			minute: 0,
		},
		state: RelayStatus.off,
	},
	{
		time: {
			hour: 7,
			minute: 0,
		},
		state: RelayStatus.on,
	},
	{
		time: {
			hour: 14,
			minute: 30,
		},
		state: RelayStatus.off,
	},
];
