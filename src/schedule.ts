import * as Agenda from 'agenda';
import { Db, MongoClient, MongoError } from 'mongodb';

import { CONFIG } from '../conf/config';
import { CombinedStatus, Schedule } from './interfaces';

export abstract class BaseSchedule {
	public static async getSchedules(): Promise<any> {
		return new Promise((resolve, reject) => {

			// Get the documents collection
			const collection = this.db.collection(CONFIG.database.collection);

			// Find some documents
			return collection.find({}).toArray((err: MongoError, docs) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(docs);
				}
			});

		});
	}

	protected static async run(): Promise<void> {
		const client = await MongoClient.connect(CONFIG.database.connectionString);
		this.db = client.db(CONFIG.database.name);
		this.agenda = new Agenda().mongo(this.db, CONFIG.database.collection);
	}

	protected static startClosestPastEvent(schedule: Schedule[]): void {
		this.agenda.now(this.getClosestPastSchedule(schedule).state);
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

	protected static async setSchedules(schedule: Schedule[], callback: (T: CombinedStatus) => void): Promise<void> {
		schedule.forEach((x: Schedule) => {
			this.agenda.define(x.state, () => {
				callback(x.state);
			});
			this.agenda.every(`${x.time.minute} ${x.time.hour} * * *`, x.state);
		});

		await new Promise((resolve) => this.agenda.once('ready', resolve));

		this.agenda.start();
	}

	private static agenda: Agenda;
	private static db: Db;
}
