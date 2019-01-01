import { LightsConfig, LightsNamespace, LightsPins, LightsStatus } from './lights/interfaces';
import { RelayNamespace, RelayPins, RelayStatus } from './relay/interfaces';
import { TemperatureSensorConfig, TemperatureSensorNamespace } from './temperature-sensor/interfaces';

interface Time {
	hour: number;
	minute: number;
}

interface Pins extends LightsPins, RelayPins {
}

export type CombinedNamespaces = LightsNamespace | RelayNamespace | TemperatureSensorNamespace;

export type CombinedStatus = LightsStatus | RelayStatus;

export interface Schedule {
	time: Time;
	state: CombinedStatus;
}

export interface Config extends LightsConfig, TemperatureSensorConfig {
	port: number;
	pins: Pins;
	logsPath: string;
	socketEmitInterval: number;
}
