import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';

import { CombinedStatus, Schedule } from './interfaces';
import { logger } from './logger';

export class BaseSchedule {

	private readonly namespaceClass: { setState: (state: CombinedStatus) => void };
	private readonly schedule: Schedule[];
	private jobs: Job[] = [];

	constructor(namespaceClass, schedule) {
		this.namespaceClass = namespaceClass;
		this.schedule = schedule;
	}

	public init(): void {
		const callback = (state: CombinedStatus) => {
			this.namespaceClass.setState(state);
		};

		this.setSchedules(this.schedule, callback);

		this.startClosestPastEvent(this.schedule, callback);
	}

	public forceSchedule(state: CombinedStatus): void {
		this.cancelAllJobs();

		this.namespaceClass.setState(state);
	}

	public resetSchedule(): void {
		this.cancelAllJobs();

		this.init();
	}

	public getSchedules(): Job[] {
		return this.jobs;
	}

	private startClosestPastEvent(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		callback(this.getClosestPastSchedule(schedule).state);
	}

	private setSchedules(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		schedule.forEach((x: Schedule, index: number) => {
			const recurrenceRule: RecurrenceRule = new RecurrenceRule();
			recurrenceRule.hour = x.time.hour;
			recurrenceRule.minute = x.time.minute;

			const jobName = `${index}: ${x.state}`;

			this.jobs.push(
				scheduleJob(
					jobName,
					recurrenceRule,
					(fireDate) => {
						callback(x.state);

						logger.info('This job was supposed to run at ' + fireDate + ', but actually ran at ' + Date.now());
					},
				),
			);
		});
	}

	private cancelAllJobs(): void {
		this.jobs.forEach((job: Job) => {
			job.cancel();
		});

		this.jobs = [];
	}

	private getClosestPastSchedule(schedule: Schedule[]): Schedule {
		const dateNow = Date.now();
		const date = new Date(dateNow);
		const currentHour = date.getHours();
		const currentMinute = date.getMinutes();

		let closestPastSchedule: Schedule = schedule[0];
		let index = schedule.length - 1;

		for (; index >= 0; index--) {
			if (
				schedule[index].time.hour < currentHour ||
				(
					schedule[index].time.hour === currentHour &&
					schedule[index].time.minute <= currentMinute
				)
			) {
				closestPastSchedule = schedule[index];
				break;
			}
		}

		return closestPastSchedule;
	}
}
