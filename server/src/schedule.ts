import * as Agenda from 'agenda';
import { Db, MongoClient } from 'mongodb';

import { CONFIG } from '../conf/config';
import { Schedule } from './interfaces';

export abstract class BaseSchedule {
	protected static async run(): Promise<void> {
		const client = await MongoClient.connect(CONFIG.database.connectionString);
		this.db = client.db(CONFIG.database.name);
		this.agenda = new Agenda().mongo(this.db, CONFIG.database.collection);
	}

	protected static startClosestPastEvent(schedule: Schedule[]): void {
		this.agenda.now(this.getClosestPastSchedule(schedule).state);
	}

	protected static getClosestPastSchedule(schedule: Schedule[]): Schedule {
		return schedule
			.filter((x: Schedule) => {
				const d = new Date();
				const scheduleHour = x.time.hour;
				const scheduleMinute = x.time.minute;
				const currentHour = d.getHours();
				const currentMinute = d.getMinutes();

				return scheduleHour < currentHour || (scheduleHour === currentHour && scheduleMinute < currentMinute);
			})
			.sort((a: Schedule, b: Schedule) => {
				const prevHour = a.time.hour;
				const nextHour = b.time.hour;
				if (prevHour < nextHour) {
					return -1;
				}
				if (prevHour > nextHour) {
					return 1;
				}
				return 0;
			})
			.slice(-1)[0];
	}

	protected static async setSchedules(schedule: Schedule[], callback: (T: string) => void): Promise<void> {
		schedule.forEach((x: Schedule) => {
			this.agenda.define(x.state, () => {
				callback(x.state);
			});
			this.agenda.every(`${x.time.minute} ${x.time.hour} * * *`, x.state);
		});

		// Wait for agenda to connect. Should never fail since connection failures
		// should happen in the `await MongoClient.connect()` call.
		await new Promise((resolve) => this.agenda.once('ready', resolve));

		// `start()` is how you tell agenda to start processing jobs. If you just
		// want to produce (AKA schedule) jobs then don't call `start()`
		this.agenda.start();
	}

	protected static getSchedules(): Promise<any> {
		return new Promise((resolve, reject) => {

			// Get the documents collection
			const collection = this.db.collection(CONFIG.database.collection);

			// Find some documents
			return collection.find({}).toArray((err, docs) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(docs);
				}
			});

		});
	}

	private static agenda: Agenda;
	private static db: Db;
}
