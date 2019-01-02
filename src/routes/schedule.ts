import * as socketIo from 'socket.io';
import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';
import { RelaySchedule } from '../relay/schedule';

interface ScheduleResponse extends Array<{ job_name: string, job_next_run: Date }> {
}

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
	const combinedSchedule = {
		...LightsSchedule.getSchedules(),
		...RelaySchedule.getSchedules(),
	};

	const response: ScheduleResponse =
		Object.keys(combinedSchedule).map((job: string) => ({
			job_name: combinedSchedule[job].name,
			job_next_run: combinedSchedule[job].nextInvocation(),
		}));

	clientSocket.emit('get', {
		data: response,
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
