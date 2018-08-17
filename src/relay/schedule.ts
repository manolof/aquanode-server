import { relaySchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Relay } from './relay';

export class RelaySchedule extends BaseSchedule {
	public static init() {
		this.setSchedules(relaySchedule, (state: string) => {
			Relay.setState(state);
		});

		this.startClosestPastEvent(relaySchedule, (state: string) => {
			Relay.setState(state);
		});
	}

}
