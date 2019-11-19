import { Schedule } from '../src/interfaces';
import { RelayStatus } from '../src/relay/interfaces';

export const lightsSchedule: Schedule[] = [
	{
		time: {
			hour: 0,
			minute: 0,
		},
		state: {
			red: 0,
			green: 0,
			blue: 1,
		},
	},
	{
		time: {
			hour: 6,
			minute: 30,
		},
		state: {
			red: 5,
			green: 1,
			blue: 5,
		},
	},
	{
		time: {
			hour: 22,
			minute: 46,
		},
		state: {
			red: 15,
			green: 16,
			blue: 14,
		},
	},
	{
		time: {
			hour: 22,
			minute: 47,
		},
		state: {
			red: 6,
			green: 5,
			blue: 9,
		},
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
