import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';

import { CombinedStatus, Schedule, ScheduleJob } from './interfaces';
import { logger } from './logger';

export class BaseSchedule {

	private jobs: Job[] = [];

	public getSchedules(): ScheduleJob[] {
		return this.jobs.map((job: Job) => {
			return {
				job_name: job.name,
				job_next_run: job.nextInvocation(),
			};
		});
	}

	public startClosestPastEvent(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		callback(this.getClosestPastSchedule(schedule).state);
	}

	public setSchedules(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		schedule.forEach((x: Schedule) => {
			const recurrenceRule: RecurrenceRule = new RecurrenceRule();
			recurrenceRule.hour = x.time.hour;
			recurrenceRule.minute = x.time.minute;

			const jobName = `${x.state}-${x.time.hour}:${x.time.minute}`;

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

	public cancelAllJobs(): void {
		this.jobs.forEach((job: Job) => {
			job.cancel();
		});

		this.jobs = [];
	}

	public getClosestPastSchedule(schedule: Schedule[]): Schedule {
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
