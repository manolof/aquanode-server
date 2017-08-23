import * as express from 'express';
import { Request, Response, Router } from 'express';

import { getStatus } from '../schedule';

const router: Router = express.Router();

router.get('/status', (req: Request, res: Response) => {
	const status = getStatus();
	const clonedStatus: any = {};
	for (const p in status) {
		if (status.hasOwnProperty(p)) {
			clonedStatus[p] = status[p];
		}
	}
	clonedStatus.time = Date.now();
	res.send(clonedStatus);
});

export default router;