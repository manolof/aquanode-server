/* tslint:disable */

export class Status {
	state: StatusState;
	time: number;
}

type StatusState = 'day' | 'night';
