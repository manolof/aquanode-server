import { Request, Response, Router } from 'express';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

const router: Router = Router();

router.get('/schedule', (req: Request, res: Response) => {
	logger.info('Serving the schedule');

	res.send(
		{
			data: LightsSchedule.getSchedules(),
		},
	);
});

router.post('/schedule', (req: Request, res: Response) => {
	logger.info('Updating the schedule');

	LightsSchedule.forceSchedule(req.body.schedule as LightsStatus);

	res.send(
		{
			data: LightsSchedule.getSchedules(),
		},
	);
});

router.post('/schedule/reset', (req: Request, res: Response) => {
	logger.info('Resetting the schedule');

	LightsSchedule.resetSchedule();

	res.send(
		{
			data: LightsSchedule.getSchedules(),
		},
	);
});

export default router;
