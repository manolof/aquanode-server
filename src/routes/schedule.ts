import * as socketIo from 'socket.io';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';
import { RelaySchedule } from '../relay/schedule';

export function schedule(socketServer: socketIo.Server) {
	socketServer
		.of('schedule')
		.on('connection', (clientSocket: socketIo.Socket) => {
			logger.debug('Serving the schedule');

			onGet(clientSocket);
			onSet(clientSocket);
			onReset(clientSocket);

			clientSocket.on('disconnect', () => {
				logger.debug('Schedule client disconnected');
			});
		});
}

function onGet(clientSocket: socketIo.Socket) {
	const combinedSchedule = [
		...LightsSchedule.getSchedules(),
		...RelaySchedule.getSchedules(),
	];

	clientSocket.emit('get', {
		data: combinedSchedule,
	});
}

function onSet(clientSocket: socketIo.Socket) {
	clientSocket.on('set', (status: LightsStatus) => {
		logger.info('Updating the schedule to: ', status);

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
