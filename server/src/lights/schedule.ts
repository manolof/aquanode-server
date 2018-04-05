import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Lights } from './lights';

export class LightsSchedule extends BaseSchedule {
	public static async run() {
		await super.run();

		await this.setSchedules(lightsSchedule, (state: string) => {
			Lights.setState(state);
		});
		this.startClosestPastEvent(lightsSchedule);
	}

}
