export interface Status {
	state: StatusState;
	time: number;
}

type StatusState = 'day' | 'night';
