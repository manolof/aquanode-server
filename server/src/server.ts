import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as path from 'path';

import { CONFIG } from '../conf/config';
import { LightsSchedule } from './lights/schedule';
import { logger } from './logger';
import scheduleRoutes from './routes/schedule';
import statusRoutes from './routes/status';

// import { SolenoidSchedule } from './solenoid/schedule';

export class Server {
	public app: express.Application;

	constructor() {
		this.app = express();

		this.config();

		this.runSchedules();

		this.routes();
	}

	public listen() {
		this.app.listen(this.app.get('port'), () => {
			logger.info(`App is running at http://localhost:${this.app.get('port')} in ${this.app.get('env')} mode`);
			logger.info('Press CTRL-C to stop\n');
		});
	}

	private config() {
		this.app.set('port', CONFIG.port);

		// Enable cors for all routes and origins
		this.app.use(cors());

		this.app.use(bodyParser.json());

		this.app.use(bodyParser.urlencoded({
			extended: false,
		}));

		this.app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));

		this.app.use(errorHandler());
	}

	private runSchedules() {
		LightsSchedule.run();
		// SolenoidSchedule.run();
	}

	private routes() {
		this.app.use('/api', statusRoutes);
		this.app.use('/api', scheduleRoutes);
	}
}

new Server().listen();
