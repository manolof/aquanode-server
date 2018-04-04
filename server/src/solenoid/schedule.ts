import { solenoidSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Solenoid } from './solenoid';

export class SolenoidSchedule extends BaseSchedule {
	public static async run() {
		await super.run();

		await this.setSchedules(solenoidSchedule, (state: string) => {
			Solenoid.setState(state);
		});
		this.startClosestPastEvent(solenoidSchedule);
	}

}
