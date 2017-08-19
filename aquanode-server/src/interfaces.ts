import { PathLike } from 'fs';

export class Status {
	state: StatusState;
	time?: number;
	nextTransitionTime?: number;
	nextTransitionState?: StatusState;
}

type StatusState = 'day' | 'night' | 'off' | 'midnight reschedule';

export interface Program {
	mode: string;
	overrideState: string;
	schedule: Schedule[];
}

interface Schedule {
	name: string;
	type: string;
	time: Time;
	state: string;
}

interface Time {
	hour: number;
	minute: number;
}

export interface Config {
	configPath?: PathLike;
	port: number;
	pins: Pins;
	fadeDuration: number;
	schedule: string;
	logFile: string;
	luminosity: Luminosity;
	rgbSpectrum: RgbSpectrum;
}

interface Pins {
	white: string;
	red: string;
	green: string;
	blue: string;
}

interface Luminosity {
	start: number;
	end: number;
}

interface RgbSpectrum {
	[key: string]: number;
}