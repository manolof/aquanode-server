import * as socketIo from 'socket.io';

import { CONFIG } from '../../conf/config';
import { Interval } from '../interval';
import lightsStatus from '../lights/status';
import { logger } from '../logger';
import relayStatus from '../relay/status';

export function status(socketIoServer: socketIo.Server) {
	const namespace = socketIoServer.of('status');

	const interval = (namespaceSocket: socketIo.Socket) => new Interval(() => {
		logger.debug('emitting status...');

		onGet(namespaceSocket);

	}, CONFIG.socketEmitInterval);

	namespace.on('connection', (namespaceSocket: socketIo.Socket) => {
		logger.info('Serving the status');
		interval(namespaceSocket).start();

		namespaceSocket.on('disconnect', () => {
			logger.info('Status client disconnected');
			interval(namespaceSocket).stop();
		});
	});
}

function onGet(namespaceSocket: socketIo.Socket) {
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

	namespaceSocket.emit('get', {
		data: extendedStatus,
	});
}
