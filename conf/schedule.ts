import { Schedule } from '../src/interfaces';
import { LightsStatus } from '../src/lights/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule2 = [
	{
		id: 0,
		time: {
			hour: 0,
			minute: 0,
		},
		r: 1,
		g: 1,
		b: 1,
	},
	{
		id: 1,
		time: {
			hour: 6,
			minute: 30,
		},
		r: 15,
		g: 15,
		b: 15,
	}
];

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
			minute: 15,
		},
		state: LightsStatus.off,
	},
	{
		time: {
			hour: 13,
			minute: 15,
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
			minute: 30,
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
			minute: 0,
		},
		state: RelayStatus.off,
	},
];
