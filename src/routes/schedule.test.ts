import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as request from 'supertest';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';
import scheduleRoutes from './schedule';

jest.mock('../app');
jest.mock('../logger');
jest.mock('../lights/schedule', () => ({
	LightsSchedule: {
		getSchedules: () => {
			return [];
		},
		forceSchedule: (...params) => {
			//
		},
		resetSchedule: (...params) => {
			//
		},
	},
}));

describe('Schedule routes', () => {
	const loggerInfo = jest.spyOn(logger, 'info');
	const lightsForceSchedule = jest.spyOn(LightsSchedule, 'forceSchedule');
	const lightsResetSchedule = jest.spyOn(LightsSchedule, 'resetSchedule');

	const app: express.Application = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use('/api', scheduleRoutes);

	describe('GET /schedule', () => {
		it('should return the schedule', (done) => {
			request(app)
				.get('/api/schedule')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect((res) => {
					expect(loggerInfo).toHaveBeenCalled();

					expect(res.body).toEqual({
						data: [],
					});
				})
				.end((err) => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('POST /schedule', () => {
		it('should force a schedule change', (done) => {
			request(app)
				.post('/api/schedule')
				.send({ schedule: LightsStatus.night })
				.expect('Content-Type', /json/)
				.expect(200)
				.expect((res) => {
					expect(loggerInfo).toHaveBeenCalled();
					expect(lightsForceSchedule).toHaveBeenCalledWith(LightsStatus.night);

					expect(res.body).toEqual({
						data: [],
					});
				})
				.end((err) => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});

	describe('POST /schedule/reset', () => {
		it('should reset the schedule to the predefined', (done) => {
			request(app)
				.post('/api/schedule/reset')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect((res) => {
					expect(loggerInfo).toHaveBeenCalled();
					expect(lightsResetSchedule).toHaveBeenCalled();

					expect(res.body).toEqual({
						data: [],
					});
				})
				.end((err) => {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});
});
