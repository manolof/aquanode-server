import * as socketIoServer from 'socket.io';
import * as socketIoClient from 'socket.io-client';

import { LightsStatus } from '../lights/interfaces';
import { LightsSchedule } from '../lights/schedule';
import { RelaySchedule } from '../relay/schedule';
import { schedule } from './schedule';

const mockJobState: LightsStatus = { red: 1, green: 2, blue: 3 };
const mockSchedules = [
	{
		name: 'job1',
		job_state: mockJobState,
		nextInvocation: jest.fn(() => {
			return new Date('2018-08-12');
		}),
	},
];

jest.mock('../lights/schedule', () => ({
	LightsSchedule: {
		getSchedules: () => mockSchedules,
		forceSchedule: jest.fn(),
		resetSchedule: jest.fn(),
	},
}));
jest.mock('../relay/schedule', () => ({
	RelaySchedule: {
		getSchedules: () => mockSchedules,
		forceSchedule: jest.fn(),
		resetSchedule: jest.fn(),
	},
}));
jest.mock('../logger');

describe('Schedule socket: integration', () => {
	const lightsForceSchedule = jest.spyOn(LightsSchedule, 'forceSchedule');
	const lightsResetSchedule = jest.spyOn(LightsSchedule, 'resetSchedule');
	const relayForceSchedule = jest.spyOn(RelaySchedule, 'forceSchedule');
	const relayResetSchedule = jest.spyOn(RelaySchedule, 'resetSchedule');

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
				expect(msg).toEqual({
					data: {
						lights: [
							{
								job_state: mockJobState,
								job_next_run: '2018-08-12T00:00:00.000Z',
							},
						],
						relay: [
							{
								job_state: mockJobState,
								job_next_run: '2018-08-12T00:00:00.000Z',
							},
						],
					},
				});

				done();
			});
		});
	});

	describe(`should receive a 'set' event and re-emit the schedule`, () => {
		it('for the lights', (done: () => void) => {
			_socketServer.of('/schedule')
				.once('connection', (clientSocket: socketIoServer.Socket) => {
					const mockLightsPayload = {
						type: 'lights',
						value: 'night',
					};

					_socketClient.emit('set', mockLightsPayload);
					expect(lightsForceSchedule).not.toHaveBeenCalled();

					clientSocket.once('set', (message) => {
						expect(message).toEqual(mockLightsPayload);
						expect(lightsForceSchedule).toHaveBeenCalledTimes(1);

						done();
					});
				});
		});

		it('for the relay', (done: () => void) => {
			_socketServer.of('/schedule')
				.once('connection', (clientSocket: socketIoServer.Socket) => {
					const mockRelayPayload = {
						type: 'relay',
						value: 'off',
					};

					_socketClient.emit('set', mockRelayPayload);
					expect(relayForceSchedule).not.toHaveBeenCalled();

					clientSocket.once('set', (message) => {
						expect(message).toEqual(mockRelayPayload);
						expect(relayForceSchedule).toHaveBeenCalledTimes(1);

						done();
					});
				});
		});
	});

	describe(`should receive a 'reset' event and re-emit the schedule`, () => {
		it('for the lights', (done: () => void) => {
			_socketServer.of('/schedule')
				.once('connection', (clientSocket: socketIoServer.Socket) => {
					_socketClient.emit('reset', {
						type: 'lights',
					});
					expect(lightsResetSchedule).not.toHaveBeenCalled();

					clientSocket.once('reset', () => {
						expect(lightsResetSchedule).toHaveBeenCalledTimes(1);

						done();
					});
				});
		});

		it('for the relay', (done: () => void) => {
			_socketServer.of('/schedule')
				.once('connection', (clientSocket: socketIoServer.Socket) => {
					_socketClient.emit('reset', {
						type: 'relay',
					});
					expect(relayResetSchedule).not.toHaveBeenCalled();

					clientSocket.once('reset', () => {
						expect(relayResetSchedule).toHaveBeenCalledTimes(1);

						done();
					});
				});
		});
	});
});
