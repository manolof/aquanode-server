export class Interval {
	private fn: any;
	private time: number;
	private timer: boolean | any;

	constructor(fn, time) {
		this.fn = fn;
		this.time = time;
		this.timer = void 0;
	}

	public start() {
		if (!this.timer) {
			this.timer = setInterval(this.fn, this.time);
		}
	}

	public stop() {
		clearInterval(this.timer);
		this.timer = void 0;
	}
}
