import { Request, Response, Router } from 'express';

import lightsStatus from '../lights/status';
import relayStatus from '../relay/status';

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
	const extendedStatus = {
		time: Date.now(),
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

	res.send(extendedStatus);
});

export default router;
