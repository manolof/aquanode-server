import * as socketIo from 'socket.io';

import { Interval } from '../interval';
import lightsStatus from '../lights/status';
import { logger } from '../logger';
import relayStatus from '../relay/status';

export function status(socket: socketIo.Socket) {
	logger.info('Serving the status');

	const interval = new Interval(() => {
		logger.debug('emitting status...');

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

		socket.emit('status', {
			data: extendedStatus,
		});

	}, 2000);

	interval.start();

	socket.on('disconnect', () => {
		logger.debug('stopped emitting status');
		interval.stop();
	});
}
