import { CombinedNamespaces } from './interfaces';
import { logger } from './logger';

export class Status {
	private _status: string;

	constructor(private id: CombinedNamespaces) {
	}

	public get(): string {
		return this._status;
	}

	public set(value: string) {
		logger.info(`Setting the ${this.id} to "${value}"`);
		this._status = value;
	}
}
