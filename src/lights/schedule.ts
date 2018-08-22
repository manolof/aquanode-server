import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { LightsStatus } from './interfaces';
import { Lights } from './lights';

export class LightsSchedule extends BaseSchedule {
	public static init() {
		this.setSchedules(lightsSchedule, (state: LightsStatus) => {
			Lights.setState(state);
		});

		this.startClosestPastEvent(lightsSchedule, (state: LightsStatus) => {
			Lights.setState(state);
		});
	}

	public static forceSchedule(state: LightsStatus): void {
		this.cancelAllJobs();

		Lights.setState(state);
	}

	public static resetSchedule(): void {
		this.cancelAllJobs();

		this.init();
	}

}
