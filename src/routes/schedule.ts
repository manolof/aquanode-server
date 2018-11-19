import * as socketIo from 'socket.io';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

export function schedule(socketIoServer: socketIo.Server) {
	const namespace = socketIoServer.of('schedule');

	namespace.on('connection', (namespaceSocket: socketIo.Socket) => {
		logger.info('Serving the schedule');

		onGet(namespaceSocket);
		onReset(namespaceSocket);
		onSet(namespaceSocket);

		namespaceSocket.on('disconnect', () => {
			logger.info('Schedule client disconnected');
		});
	});

}

function onGet(namespaceSocket: socketIo.Socket) {
	logger.debug('emitting schedule...');
	namespaceSocket.emit('get', {
		data: LightsSchedule.getSchedules(),
	});
}

function onReset(namespaceSocket: socketIo.Socket) {
	namespaceSocket.on('reset', () => {
		logger.info('Resetting the schedule');

		LightsSchedule.resetSchedule();

		onGet(namespaceSocket);
	});
}

function onSet(namespaceSocket: socketIo.Socket) {
	namespaceSocket.on('set', (message: LightsStatus) => {
		logger.info('Updating the schedule');

		LightsSchedule.forceSchedule(message);

		onGet(namespaceSocket);
	});
}
