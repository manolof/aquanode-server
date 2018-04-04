export enum Fade {
	in,
	out,
}

export enum LightsStatus {
	off = 'off',
	day = 'day',
	night = 'night',
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
