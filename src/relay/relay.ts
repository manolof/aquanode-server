/* tslint:disable */
/* istanbul ignore next */
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
	public static shutdown(): void {
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

	private options;

	constructor() {
		this.options = {
			relay: new Gpio(CONFIG.pins.relay, { mode: Gpio.OUTPUT }),
		};
	}

	public setState(state: RelayStatus): void {
		switch (state) {
			case RelayStatus.on:
				this.setOn();
				break;

			case RelayStatus.off:
				this.setOff();
				break;

			default:
				logger.error(`A relay change was requested for an invalid state ${state}.
				Must be one of ${RelayStatus.on}, or ${RelayStatus.off}`);
		}
	}

	private setOn(): void {
		status.set(RelayStatus.on);
		this.setRelay(0);
	}

	private setOff(): void {
		status.set(RelayStatus.off);
		this.setRelay(1);
	}

	private setRelay(mode: number): void {
		this.options.relay.digitalWrite(mode);
	}
}

process.on('SIGHUP', Relay.shutdown);
process.on('SIGINT', Relay.shutdown);
process.on('SIGCONT', Relay.shutdown);
process.on('SIGTERM', Relay.shutdown);
