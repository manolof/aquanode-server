import { LightsStatus } from './lights/interfaces';
import { logger } from './logger';

class Status {
	private _status: LightsStatus;

	constructor(private id: string) {
	}

	public get(): string {
		return LightsStatus[this._status];
	}

	public set(value: LightsStatus) {
		logger.info(`Setting the "${this.id}" state to`, LightsStatus[value]);
		this._status = value;
	}
}

export const status = new Status('lights');
