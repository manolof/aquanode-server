import * as socketIo from 'socket.io';

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import lightsStatus from '../lights/status';
import { logger } from '../logger';
import relayStatus from '../relay/status';

export function status(socketServer: socketIo.Server) {
	socketServer
		.of('status')
		.on('connection', (clientSocket: socketIo.Socket) => {
			logger.info('Serving the status');

			const interval = statusInterval(clientSocket);

			interval.start();

			clientSocket.on('disconnect', () => {
				logger.info('Status client disconnected');
				interval.stop();
			});
		});
}

function onGet(clientSocket: socketIo.Socket) {
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

	clientSocket.emit('get', {
		data: extendedStatus,
	});
}

function statusInterval(clientSocket: socketIo.Socket) {
	return new Interval(() => {
		logger.debug('emitting status...');

		onGet(clientSocket);

	}, CONFIG.socketEmitInterval);
}
