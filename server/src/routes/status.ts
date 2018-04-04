import { Request, Response, Router } from 'express';

import { status } from '../status';

const router: Router = Router();

router.get('/status', (req: Request, res: Response) => {
	const extendedStatus = {
		state: status.get(),
		time: Date.now(),
	};

	res.send(extendedStatus);
});

export default router;
