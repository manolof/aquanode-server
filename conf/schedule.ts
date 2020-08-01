import { Schedule } from '../src/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: { hour: 0, minute: 0 },
		state: { red: 0, green: 0, blue: 0, white: 0 },
	},
	{
		time: { hour: 8, minute: 30 }, // ON
		state: { red: 0, green: 0, blue: 0, white: 250 },
	},
	{
		time: { hour: 13, minute: 0 }, // OFF
		state: { red: 0, green: 0, blue: 0, white: 0 },
	},
	{
		time: { hour: 17, minute: 30 }, // ON
		state: { red: 0, green: 0, blue: 0, white: 250 },
	},
	{
		time: { hour: 22, minute: 0 }, // OFF
		state: { red: 0, green: 0, blue: 0, white: 0 },
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
];
