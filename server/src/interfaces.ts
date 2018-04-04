import { LightsConfig, LightsPins } from './lights/interfaces';
import { SolenoidPins } from './solenoid/interfaces';

interface Time {
	hour: number;
	minute: number;
}

interface Pins extends LightsPins, SolenoidPins {
}

interface Database {
	name: string;
	connectionString: string;
	collection: string;
}

export interface Schedule {
	time: Time;
	state: string;
}

export interface Config extends LightsConfig {
	port: number;
	pins: Pins;
	logFile: string;
	database: Database;
}

export enum Switch {
	off,
	on,
}
