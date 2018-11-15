/* tslint:disable */
const pigpio = process.env.NODE_ENV === 'development' ?
	require('pigpio-mock') :
	require('pigpio');
/* tslint:enable */
const Gpio = pigpio.Gpio;

import { CONFIG } from '../../conf/config';
import { logger } from '../logger';
import { RelayStatus } from './interfaces';
import status from './status';

export class Relay {
	public static setState(state: string) {
		const relay = new Relay();

		switch (state) {
			case RelayStatus.on:
				relay.setOn();
				break;

			case RelayStatus.off:
				relay.setOff();
				break;

			default:
				logger.error(`A relay change was requested for an invalid state ${state}.
				Must be one of ${RelayStatus.on}, or ${RelayStatus.off}`);
		}
	}

	public static shutdown() {
		logger.info('Shutting the relay down, cleanup running');

		try {
			pigpio.terminate();
		}
		catch (e) {
			// fails on dev, since `pigpio`'s prototype doesn't contain `terminate()`
			logger.warn(e);
		}

		process.exit(0);
	}

	private static instance: Relay;
	private options;

	constructor() {
		this.options = {
			relay: new Gpio(CONFIG.pins.relay, { mode: Gpio.OUTPUT }),
		};

		if (!Relay.instance) {
			Relay.instance = this;
		}

		return Relay.instance;
	}

	public setOn() {
		status.set(RelayStatus.on);
		this.setRelay(0);
	}

	public setOff() {
		status.set(RelayStatus.off);
		this.setRelay(1);
	}

	private setRelay(mode: number) {
		this.options.relay.digitalWrite(mode);
	}
}

process.on('SIGHUP', Relay.shutdown);
process.on('SIGINT', Relay.shutdown);
process.on('SIGCONT', Relay.shutdown);
process.on('SIGTERM', Relay.shutdown);
