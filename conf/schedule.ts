import { Schedule } from '../src/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: { hour: 1, minute: 0 },
		state: { red: 0, green: 0, blue: 0 },
	},
	{
		time: { hour: 9, minute: 0 },
		state: { red: 15, green: 8, blue: 12 },
	},
	{
		time: { hour: 16, minute: 30 }, // important
		state: { red: 250, green: 250, blue: 250 },
	},
	{
		time: { hour: 17, minute: 0 }, // important
		state: { red: 0, green: 0, blue: 0 },
	},
	{
		time: { hour: 21, minute: 30 }, // important
		state: { red: 250, green: 250, blue: 250 },
	},
	{
		time: { hour: 22, minute: 0 }, // important
		state: { red: 120, green: 30, blue: 90 },
	},
	{
		time: { hour: 23, minute: 30 },
		state: { red: 15, green: 0, blue: 10 },
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
			hour: 17,
			minute: 0,
		},
		state: RelayStatus.on,
	},
	{
		time: {
			hour: 22,
			minute: 0,
		},
		state: RelayStatus.off,
	},
];
