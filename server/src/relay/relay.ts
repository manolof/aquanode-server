/* tslint:disable */
const pigpio = process.env.NODE_ENV === 'development' ?
	require('pigpio-mock') :
	require('pigpio');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { Switch } from '../interfaces';
import { logger } from '../logger';
import { RelayStatus } from './interfaces';
import status from './status';

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

	public static shutdown() {
		logger.info('Shutting the lights down, cleanup running.');
		pigpio.terminate();
		process.exit(0);
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
		status.set(RelayStatus.on);
		this.setRelay(Switch.on);
	}

	public setOff() {
		status.set(RelayStatus.off);
		this.setRelay(Switch.off);
	}

	private setRelay(mode: number) {
		this.options.solenoid.digitalWrite(mode);
	}
}

process.on('SIGHUP', Relay.shutdown);
process.on('SIGINT', Relay.shutdown);
process.on('SIGCONT', Relay.shutdown);
process.on('SIGTERM', Relay.shutdown);
