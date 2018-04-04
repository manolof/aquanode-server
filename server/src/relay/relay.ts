/* tslint:disable */
import { RelayStatus } from './interfaces';

const Gpio = process.env.NODE_ENV === 'development' ?
	require('pigpio-mock').Gpio :
	require('pigpio').Gpio;
/* tslint:enable */

import { CONFIG } from '../../conf/config';
import { Switch } from '../interfaces';
// import { RelayStatus } from './interfaces';
import { logger } from '../logger';
// import { status } from '../status';

export class Relay {
	public static setState(state: string) {
		const solenoid = new Relay();

		switch (state) {
			case RelayStatus.on:
				solenoid.setOn();
				break;
			case RelayStatus.off:
				solenoid.setOff();
				break;
			default:
				logger.error(`A solenoid change was requested for an invalid state ${state}.
				Must be one of ${RelayStatus.on}, or ${RelayStatus.off}`);
		}
	}

	private static instance: Relay;
	private options;

	constructor() {
		this.options = {
			solenoid: new Gpio(CONFIG.pins.solenoid, { mode: Gpio.OUTPUT }),
		};

		if (!Relay.instance) {
			Relay.instance = this;
		}

		return Relay.instance;
	}

	public setOn() {
		// status.set(RelayStatus.day);
		this.setRelay(Switch.on);
	}

	public setOff() {
		// status.set(RelayStatus.off);
		this.setRelay(Switch.off);
	}

	private setRelay(mode: number) {
		this.options.solenoid.digitalWrite(mode);
	}
}
