import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';

import { CONFIG } from '../conf/config';
import { LightsSchedule } from './lights/schedule';
// import { RelaySchedule } from './relay/schedule';
import scheduleRoutes from './routes/schedule';
import statusRoutes from './routes/status';

const app: express.Application = express();

config(app);
runSchedules();
routes(app);

function config(_app) {
	_app.set('port', CONFIG.port);

	// Enable cors for all routes and origins
	_app.use(cors());

	_app.use(bodyParser.json());

	_app.use(bodyParser.urlencoded({
		extended: false,
	}));

	_app.use(errorHandler());
}

function routes(_app) {
	_app.use('/api', statusRoutes);
	_app.use('/api', scheduleRoutes);
}

function runSchedules() {
	LightsSchedule.init();
	// RelaySchedule.init();
}

export {
	app,
};
