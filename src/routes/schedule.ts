import * as socketIo from 'socket.io';

import { Interval } from '../interval';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

export function schedule(socket: socketIo.Socket) {
	logger.info('Serving the schedule');

	const interval = new Interval(() => {
		logger.debug('emitting schedule...');

		socket.emit('schedule', {
			data: LightsSchedule.getSchedules(),
		});

	}, 2000);

	interval.start();

	socket.on('disconnect', () => {
		logger.debug('stopped emitting schedule');
		interval.stop();
	});
}

// router.post('/schedule', (req: Request, res: Response) => {
// 	logger.info('Updating the schedule');
//
// 	LightsSchedule.forceSchedule(req.body.schedule as LightsStatus);
//
// 	res.send(
// 		{
// 			data: LightsSchedule.getSchedules(),
// 		},
// 	);
// });

// router.post('/schedule/reset', (req: Request, res: Response) => {
// 	logger.info('Resetting the schedule');
//
// 	LightsSchedule.resetSchedule();
//
// 	res.send(
// 		{
// 			data: LightsSchedule.getSchedules(),
// 		},
// 	);
// });
