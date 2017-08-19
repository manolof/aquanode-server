import * as express from 'express';
import { Request, Response, Router } from 'express';

import { getSchedule, setSchedule } from '../schedule';
import { logger } from '../logger';

const router: Router = express.Router();

router.get('/schedule', (req: Request, res: Response) => {
	logger.info('Serving the schedule');
	res.send(getSchedule());
});

router.post('/schedule', (req: Request, res: Response) => {
	logger.info('Updating the schedule');
	setSchedule(req.body);
	res.send(getSchedule());
});

export default router;
