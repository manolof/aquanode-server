import * as socketIo from 'socket.io';
import { CombinedNamespaces, CombinedStatus } from '../interfaces';
import { LightsSchedule } from '../lights/schedule';
import { logger } from '../logger';
import { RelaySchedule } from '../relay/schedule';

interface Schedule {
	job_name: string;
	job_next_run: Date;
}

interface ScheduleResponse {
	lights: Schedule[];
	relay: Schedule[];
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
	const lightsSchedule = LightsSchedule.getSchedules();
	const relaySchedule = RelaySchedule.getSchedules();
	const transformSchedule = (_schedule) => {
		return Object.keys(_schedule).map((job: string) => ({
			job_name: _schedule[job].name,
			job_next_run: _schedule[job].nextInvocation(),
		}));
	};

	const response: ScheduleResponse = {
		lights: transformSchedule(lightsSchedule),
		relay: transformSchedule(relaySchedule),
	};

	clientSocket.emit('get', {
		data: response,
	});
}

function onSet(clientSocket: socketIo.Socket) {
	clientSocket.on('set', (payload: { type: CombinedNamespaces, value: CombinedStatus }) => {
		const { type, value } = payload;
		logger.info('Updating the schedule');

		switch (type) {
			case 'lights':
				LightsSchedule.forceSchedule(value);
				break;

			case 'relay':
				RelaySchedule.forceSchedule(value);
				break;
		}

		onGet(clientSocket);
	});
}

function onReset(clientSocket: socketIo.Socket) {
	clientSocket.on('reset', (payload: { type: CombinedNamespaces }) => {
		const { type } = payload;
		logger.info('Resetting the schedule');

		switch (type) {
			case 'lights':
				LightsSchedule.resetSchedule();
				break;

			case 'relay':
				RelaySchedule.resetSchedule();
				break;
		}

		onGet(clientSocket);
	});
}
