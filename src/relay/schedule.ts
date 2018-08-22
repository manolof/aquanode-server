import { relaySchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
// import { RelayStatus } from './interfaces';
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

	// TODO
	// public static forceSchedule(state: RelayStatus): void {
	// 	this.cancelAllJobs();
	//
	// 	Relay.setState(state);
	// }
	//
	// public static resetSchedule(): void {
	// 	this.cancelAllJobs();
	//
	// 	this.init();
	// }

}
