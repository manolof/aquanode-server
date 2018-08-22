import { LightsConfig, LightsPins, LightsStatus } from './lights/interfaces';
import { RelayPins, RelayStatus } from './relay/interfaces';

interface Time {
	hour: number;
	minute: number;
}

interface Pins extends LightsPins, RelayPins {
}

export type CombinedStatus = LightsStatus | RelayStatus;

export interface Schedule {
	time: Time;
	state: CombinedStatus;
}

export interface Config extends LightsConfig {
	port: number;
	pins: Pins;
	logFile: string;
}
