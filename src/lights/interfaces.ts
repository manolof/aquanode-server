export type LightsNamespace = 'lights';

export enum Fade {
	in,
	out,
}

export enum LightsStatus {
	day = 'Lights: day',
	night = 'Lights: night',
	off = 'Lights: off',
}

export interface RgbSpectrum {
	[key: string]: number[];
}

export interface LightsConfig {
	fadeDuration: number;
	rgbSpectrum: RgbSpectrum;
}

export interface LightsPins {
	white: number;
	red: number;
	green: number;
	blue: number;
}
