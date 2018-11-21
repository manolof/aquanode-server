import * as socketIo from 'socket.io';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';

export function schedule(socketServer: socketIo.Server) {
	socketServer
		.of('schedule')
		.on('connection', (clientSocket: socketIo.Socket) => {
			logger.info('Serving the schedule');

			onGet(clientSocket);
			onSet(clientSocket);
			onReset(clientSocket);

			clientSocket.on('disconnect', () => {
				logger.info('Schedule client disconnected');
			});
		});
}

function onGet(clientSocket: socketIo.Socket) {
	logger.debug('emitting schedule...');
	clientSocket.emit('get', {
		data: LightsSchedule.getSchedules(),
	});
}

function onSet(clientSocket: socketIo.Socket) {
	clientSocket.on('set', (status: LightsStatus) => {
		logger.info('Updating the schedule');

		LightsSchedule.forceSchedule(status);

		onGet(clientSocket);
	});
}

function onReset(clientSocket: socketIo.Socket) {
	clientSocket.on('reset', () => {
		logger.info('Resetting the schedule');

		LightsSchedule.resetSchedule();

		onGet(clientSocket);
	});
}
