import { Request, Response, Router } from 'express';

import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

const router: Router = Router();

router.get('/schedule', (req: Request, res: Response) => {
	logger.info('Serving the schedule');
	const schedules = LightsSchedule.getSchedules();

	res.send(schedules);
});

router.post('/schedule', (req: Request, res: Response) => {
	logger.info('Updating the schedule');
	// setSchedule(req.body);
	// res.send(getSchedule());
});

export default router;
