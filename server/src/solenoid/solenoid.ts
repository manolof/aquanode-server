/* tslint:disable */
import { SolenoidStatus } from './interfaces';

const Gpio = process.env.NODE_ENV === 'development' ?
	require('pigpio-mock').Gpio :
	require('pigpio').Gpio;
/* tslint:enable */

import { CONFIG } from '../../conf/config';
import { Switch } from '../interfaces';
// import { SolenoidStatus } from './interfaces';
import { logger } from '../logger';
// import { status } from '../status';

export class Solenoid {
	public static setState(state: string) {
		const solenoid = new Solenoid();

		switch (state) {
			case SolenoidStatus.on:
				solenoid.setOn();
				break;
			case SolenoidStatus.off:
				solenoid.setOff();
				break;
			default:
				logger.error(`A solenoid change was requested for an invalid state ${state}.
				Must be one of ${SolenoidStatus.on}, or ${SolenoidStatus.off}`);
		}
	}

	private static instance: Solenoid;
	private options;

	constructor() {
		this.options = {
			solenoid: new Gpio(CONFIG.pins.solenoid, { mode: Gpio.OUTPUT }),
		};

		if (!Solenoid.instance) {
			Solenoid.instance = this;
		}

		return Solenoid.instance;
	}

	public setOn() {
		// status.set(SolenoidStatus.day);
		this.setSolenoid(Switch.on);
	}

	public setOff() {
		// status.set(SolenoidStatus.off);
		this.setSolenoid(Switch.off);
	}

	private setSolenoid(mode: number) {
		this.options.solenoid.digitalWrite(mode);
	}
}
