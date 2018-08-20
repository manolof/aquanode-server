import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';

import { CombinedStatus, Schedule } from './interfaces';
import { logger } from './logger';

interface ScheduleJob {
	job_name: string;
	job_next_run: Date;
}

interface ScheduleResponse extends Array<ScheduleJob> {}

export abstract class BaseSchedule {
	public static getSchedules(): ScheduleResponse {
		return this.jobs.map((job: Job) => {
			return {
				job_name: job.name,
				job_next_run: job.nextInvocation(),
			};
		});
	}

	protected static startClosestPastEvent(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		callback(this.getClosestPastSchedule(schedule).state);
	}

	protected static setSchedules(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
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

						logger.info('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
					},
				),
			);
		});
	}

	protected static cancelAllJobs(): void {
		this.jobs.forEach((job: Job) => {
			job.cancel();
		});

		this.jobs = [];
	}

	private static jobs: Job[] = [];

	private static getClosestPastSchedule(schedule: Schedule[]): Schedule {
		const d = new Date();
		const currentHour = d.getHours();
		const currentMinute = d.getMinutes();

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
