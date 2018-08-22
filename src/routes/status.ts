import { Request, Response, Router } from 'express';

import lightsStatus from '../lights/status';
import { logger } from '../logger';
import relayStatus from '../relay/status';

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
	logger.info('Serving the status');

	const extendedStatus = {
		time: new Date().toISOString(),
		entities: [
			{
				type: 'lights',
				status: lightsStatus.get(),
			},
			{
				type: 'relay',
				status: relayStatus.get(),
			},
		],
	};

	res.send(
		{
			data: extendedStatus,
		},
	);
});

export default router;
