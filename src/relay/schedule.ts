import { relaySchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { RelayStatus } from './interfaces';
import { Relay } from './relay';

declare module '../schedule' {
	interface BaseSchedule {
		init(): void;
	}
}

export const RelaySchedule = new BaseSchedule();

RelaySchedule.constructor.prototype.init = init;

function init() {
	RelaySchedule.setSchedules(relaySchedule, (state: RelayStatus) => {
		Relay.setState(state);
	});

	RelaySchedule.startClosestPastEvent(relaySchedule, (state: RelayStatus) => {
		Relay.setState(state);
	});
}

// TODO
// function forceSchedule() {
// }
//
// function resetSchedule() {
// }
