import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as request from 'supertest';

import { logger } from '../logger';
import statusRoutes from './status';

jest.mock('../app');
jest.mock('../logger');
jest.mock('../lights/status', () => ({
	__esModule: true,
	default: {
		get: () => {
			return 'test1';
		}
	},
}));
jest.mock('../relay/status', () => ({
	__esModule: true,
	default: {
		get: () => {
			return 'test1';
		}
	},
}));

describe('Status routes', () => {
	const loggerInfo = jest.spyOn(logger, 'info');

	const app: express.Application = express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use('/api', statusRoutes);

	describe('GET /status', () => {
		it('should return the status', (done) => {
			request(app)
				.get('/api/status')
				.expect('Content-Type', /json/)
				.expect(200)
				.expect((res) => {
					expect(loggerInfo).toHaveBeenCalled();

					expect(res.body).toEqual({
						data: {
							time: expect.any(String),
							entities: [
								{
									type: 'lights',
									status: 'test1',
								},
								{
									type: 'relay',
									status: 'test1',
								},
							],

						},
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
