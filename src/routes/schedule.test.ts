import * as socketIoServer from 'socket.io';
import * as socketIoClient from 'socket.io-client';

import { LightsSchedule } from '../lights/schedule';
import { schedule } from './schedule';

jest.mock('../lights/schedule', () => ({
	LightsSchedule: {
		getSchedules: () => {
			return [];
		},
		forceSchedule: () => {
			//
		},
		resetSchedule: () => {
			//
		},
	},
}));
jest.mock('../logger');

describe('Schedule socket: integration', () => {
	const lightsForceSchedule = jest.spyOn(LightsSchedule, 'forceSchedule');
	const lightsResetSchedule = jest.spyOn(LightsSchedule, 'resetSchedule');

	let _socketClient: socketIoServer.Socket;
	let _socketServer: socketIoServer.Server;

	beforeEach(() => {
		_socketServer = socketIoServer.listen(1337);
		_socketClient = socketIoClient.connect('http://0.0.0.0:1337/schedule');
		schedule(_socketServer);
	});

	afterEach(() => {
		_socketClient.disconnect();
		_socketServer.close();
	});

	it('should set up the namespace', (done: () => void) => {
		_socketClient.once('connect', () => {
			expect(_socketServer.engine['clientsCount']).toBe(1);
			expect(
				Object.keys(_socketServer.nsps)
					.some((nsp) => _socketServer.nsps[nsp].name === '/schedule')
			).toBe(true);

			done();
		});
	});

	it('should emit the schedule on connect', (done: () => void) => {
		_socketClient.once('connect', () => {
			_socketClient.once('get', (msg) => {
				expect(msg).toEqual({ data: [] });

				done();
			});
		});
	});

	it(`should receive a 'set' event and re-emit the schedule`, (done: () => void) => {
		_socketServer.of('/schedule')
			.once('connection', (clientSocket: socketIoServer.Socket) => {
				_socketClient.emit('set', 'night');
				expect(lightsForceSchedule).not.toHaveBeenCalled();

				clientSocket.once('set', (message) => {
					expect(message).toBe('night');
					expect(lightsForceSchedule).toHaveBeenCalledTimes(1);

					done();
				});
			});
	});

	it(`should receive a 'reset' event and re-emit the schedule`, (done: () => void) => {
		_socketServer.of('/schedule')
			.once('connection', (clientSocket: socketIoServer.Socket) => {
				_socketClient.emit('reset');
				expect(lightsResetSchedule).not.toHaveBeenCalled();

				clientSocket.once('reset', () => {
					expect(lightsResetSchedule).toHaveBeenCalledTimes(1);

					done();
				});
			});
	});
});
