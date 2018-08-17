import { Job, RecurrenceRule, scheduleJob } from 'node-schedule';

import { CombinedStatus, Schedule } from './interfaces';
import { logger } from './logger';

export abstract class BaseSchedule {
	public static getSchedules(): { name: string, next: Date }[] {
		return this.jobs.map((job: Job) => {
			return {
				name: job.name,
				next: job.nextInvocation(),
			};
		});
	}

	protected static startClosestPastEvent(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		callback(this.getClosestPastSchedule(schedule).state);
	}

	protected static getClosestPastSchedule(schedule: Schedule[]): Schedule {
		const d = new Date();
		const currentHour = d.getHours();
		const currentMinute = d.getMinutes();

		let closestPastSchedule: Schedule = schedule[0];
		let index = schedule.length - 1;

		for (; index >= 0; index--) {
			if (
				schedule[index].time.hour < currentHour ||
				(schedule[index].time.hour === currentHour && schedule[index].time.minute <= currentMinute)
			) {
				closestPastSchedule = schedule[index];
				break;
			}
		}

		return closestPastSchedule;
	}

	protected static setSchedules(schedule: Schedule[], callback: (T: CombinedStatus) => void): void {
		schedule.forEach((x: Schedule) => {
			const recurrenceRule: RecurrenceRule = new RecurrenceRule();
			recurrenceRule.hour = x.time.hour;
			recurrenceRule.minute = x.time.minute;

			const jobName = `${x.state}-${x.time.hour}:${x.time.minute}`;

			this.jobs.push(scheduleJob(
				jobName,
				recurrenceRule,
				(fireDate) => {
					callback(x.state);

					logger.info('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
				}));
		});
	}

	private static jobs: Job[] = [];
}
