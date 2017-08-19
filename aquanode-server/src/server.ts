import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';

import { getConfig } from './schedule';
import { logger } from './logger';
import scheduleRoutes from './routes/schedule';
import statusRoutes from './routes/status';

const config = getConfig();

export class Server {

	public app: Application;

	constructor() {
		this.app = express();

		this.config();

		this.routes();
	}

	private config() {
		this.app.use(this.allowCrossDomain);

		this.app.use(bodyParser.json());

		this.app.use(bodyParser.urlencoded({
			extended: false,
		}));

		this.app.use((error: any, request: Request, response: Response, next: NextFunction) => {
			error.status = 404;
			next(error);
		});
	}

	private routes() {
		this.app.use('/api', scheduleRoutes);
		this.app.use('/api', statusRoutes);
	}

	private allowCrossDomain = (request: Request, response: Response, next: NextFunction) => {
		response.header('Access-Control-Allow-Origin', '*');
		response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		response.header('Access-Control-Allow-Headers', 'Content-Type');

		next();
	};
}

const server = new Server().app.listen(config.port || 80, () => {
	const port = server.address().port;
	logger.info('Aquanode server listening on port ' + port);
});
