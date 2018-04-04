import { solenoidSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Relay } from './relay';

export class RelaySchedule extends BaseSchedule {
	public static async run() {
		await super.run();

		await this.setSchedules(solenoidSchedule, (state: string) => {
			Relay.setState(state);
		});
		this.startClosestPastEvent(solenoidSchedule);
	}

}
