import * as socketIoServer from 'socket.io';
import * as socketIoClient from 'socket.io-client';

import { CONFIG } from '../../conf/config';
import { status } from './status';

jest.useFakeTimers();

jest.mock('../../conf/config', () => ({
	CONFIG: {
		logsPath: 'log.log',
		socketEmitInterval: 500,
	},
}));
jest.mock('../lights/status', () => ({
	__esModule: true,
	default: {
		get: () => {
			return 'test1';
		}
	},
}));
jest.mock('../logger');
jest.mock('../relay/status', () => ({
	__esModule: true,
	default: {
		get: () => {
			return 'test1';
		}
	},
}));
jest.mock('../temperature-sensor/status', () => ({
	__esModule: true,
	default: {
		get: () => {
			return '42';
		}
	},
}));

describe('Status socket: integration', () => {
	let _socketClient: socketIoServer.Socket;
	let _socketServer: socketIoServer.Server;

	beforeEach(() => {
		_socketServer = socketIoServer.listen(1338);
		_socketClient = socketIoClient.connect('http://0.0.0.0:1338/status');
		status(_socketServer);
	});

	afterEach(() => {
		jest.clearAllTimers();
		_socketClient.disconnect();
		_socketServer.close();
	});

	it('should set up the namespace', (done: () => void) => {
		_socketClient.once('connect', () => {
			expect(_socketServer.engine['clientsCount']).toBe(1);
			expect(
				Object.keys(_socketServer.nsps)
					.some((nsp) => _socketServer.nsps[nsp].name === '/status')
			).toBe(true);

			done();
		});
	});

	it('should emit the status on connect', (done: () => void) => {
		_socketClient.once('connect', () => {
			jest.advanceTimersByTime(CONFIG.socketEmitInterval);

			_socketClient.once('get', (msg) => {
				expect(msg).toEqual({
					data: {
						time: expect.any(String),
						entities: [
							{
								type: 'lights',
								status: 'test1',
							},
							{
								type: 'relay',
								status: 'test1',
							},
							{
								type: 'temperatureSensor',
								status: '42',
							},
						],
					},
				});

				done();
			});
		});
	});
});
