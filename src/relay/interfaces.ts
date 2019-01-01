export type RelayNamespace = 'relay';

export enum RelayStatus {
	off = 'Relay: off',
	on = 'Relay: on',
}

export interface RelayPins {
	relay: number;
}
