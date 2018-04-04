import { lightsSchedule } from '../../conf/schedule';
import { BaseSchedule } from '../schedule';
import { Lights } from './lights';

export class LightsSchedule extends BaseSchedule {
	public static async run() {
		await super.run();

		await this.setSchedules(lightsSchedule, (state: string) => {
			Lights.setState(state);
		});
		this.startClosestPastEvent(lightsSchedule);
	}

}

/*
export const findDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('schedules');
	// Find some documents
	collection.find({}).toArray(function(err, docs) {
		callback(docs);
	});
};

 */
