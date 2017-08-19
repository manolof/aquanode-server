/* tslint:disable */

export class Status {
	time: number;
	state: StatusState;
	nextTransitionTime: number;
	nextTransitionState: StatusState;
}

type StatusState = 'day' | 'night' | 'off';
