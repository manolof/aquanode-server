import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { LightsStatus } from './interfaces';
import { Lights } from './lights';

declare module '../schedule' {
	interface BaseSchedule {
		init(): void;

		forceSchedule(state: LightsStatus): void;

		resetSchedule(): void;
	}
}

export const LightsSchedule = new BaseSchedule();

LightsSchedule.constructor.prototype.init = init;
LightsSchedule.constructor.prototype.forceSchedule = forceSchedule;
LightsSchedule.constructor.prototype.resetSchedule = resetSchedule;

function init() {
	LightsSchedule.setSchedules(lightsSchedule, (state: LightsStatus) => {
		Lights.setState(state);
	});

	LightsSchedule.startClosestPastEvent(lightsSchedule, (state: LightsStatus) => {
		Lights.setState(state);
	});
}

function forceSchedule(state: LightsStatus): void {
	LightsSchedule.cancelAllJobs();

	Lights.setState(state);
}

function resetSchedule(): void {
	LightsSchedule.cancelAllJobs();

	this.init();
}
