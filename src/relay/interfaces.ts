export type RelayNamespace = 'relay';

export enum RelayStatus {
	off = 'off',
	on = 'on',
}

export interface RelayPins {
	relay: number;
}
