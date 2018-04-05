import { Request, Response, Router } from 'express';

import lightsStatus from '../lights/status';
import relayStatus from '../relay/status';

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
	const extendedStatus = {
		time: Date.now(),
		lights: lightsStatus.get(),
		relay: relayStatus.get(),
	};

	res.send(extendedStatus);
});

export default router;
