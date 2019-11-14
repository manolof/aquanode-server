export type RelayNamespace = 'relay';

export enum RelayStatus {
	off = 0,
	on = 1,
}

export interface RelayPins {
	relay: number;
}
