export type LightsNamespace = 'lights';

export interface LightsStatus {
	red: number;
	green: number;
	blue: number;
	white: number;
}

export interface LightsConfig {
	fadeInterval: number;
}

export interface LightsPins {
	red: number;
	green: number;
	blue: number;
	white: number;
}
