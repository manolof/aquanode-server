import * as socketIo from 'socket.io';

import { CONFIG } from '../../conf/config';
import { CombinedNamespaces } from '../interfaces';
import { Interval } from '../interval';
import lightsStatus from '../lights/status';
import { logger } from '../logger';
import relayStatus from '../relay/status';
import temperatureSensorStatus from '../temperature-sensor/status';

interface StatusResponse {
	time: string;
	entities: Array<{ type: CombinedNamespaces, status: string }>;
}

export function status(socketServer: socketIo.Server) {
	socketServer
		.of('status')
		.on('connection', (clientSocket: socketIo.Socket) => {
			logger.debug('Serving the status');

			const interval = statusInterval(clientSocket);

			interval.start();

			clientSocket.on('disconnect', () => {
				logger.debug('Status client disconnected');
				interval.stop();
			});
		});
}

function onGet(clientSocket: socketIo.Socket) {
	const extendedStatus: StatusResponse = {
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
			{
				type: 'temperatureSensor',
				status: temperatureSensorStatus.get(),
			},
		],
	};

	clientSocket.emit('get', {
		data: extendedStatus,
	});
}

function statusInterval(clientSocket: socketIo.Socket) {
	return new Interval(() => {
		onGet(clientSocket);

	}, CONFIG.socketEmitInterval);
}
