import { JobAttributes } from 'agenda';
import { Request, Response, Router } from 'express';

import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

const router: Router = Router();

router.get('/schedule', async (req: Request, res: Response) => {
	logger.info('Serving the schedule');
	const schedules = await LightsSchedule.getSchedules();

	const extendedSchedule = schedules.map((job: JobAttributes) => {
		const { name, nextRunAt, lastRunAt } = job;
		return { name, nextRunAt, lastRunAt };
	});

	res.send(extendedSchedule);
});

router.post('/schedule', (req: Request, res: Response) => {
	logger.info('Updating the schedule');
	// setSchedule(req.body);
	// res.send(getSchedule());
});

export default router;
