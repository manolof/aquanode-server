import { Schedule } from '../src/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: { hour: 0, minute: 0 },
		state: { red: 0, green: 0, blue: 0 },
	},
	{
		time: { hour: 6, minute: 30 },
		state: { red: 15, green: 15, blue: 15 },
	},
	{
		time: { hour: 6, minute: 45 },
		state: { red: 250, green: 250, blue: 250 },
	},
	{
		time: { hour: 7, minute: 2 },
		state: { red: 0, green: 0, blue: 0 },
	},
	{
		time: { hour: 13, minute: 0 },
		state: { red: 250, green: 250, blue: 250 },
	},
	{
		time: { hour: 15, minute: 0 },
		state: { red: 120, green: 100, blue: 100 },
	},
	{
		time: { hour: 16, minute: 0 },
		state: { red: 15, green: 15, blue: 15 },
	},
	{
		time: { hour: 23, minute: 30 },
		state: { red: 5, green: 5, blue: 5 },
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
