import * as socketIoServer from 'socket.io';
import * as socketIoClient from 'socket.io-client';

import { temperature } from './temperature';

jest.mock('../../conf/firebase', () => ({
	temperatureLogCollection: {
		get: jest.fn(() => ({
			docs: [
				{
					id: 'a1',
					data: jest.fn(() => ({
						date: {
							toDate: jest.fn(() => '2018-12-02'),
						},
						temperature: '42',
					})),
				},
			],
		})),
	},
}));
jest.mock('../logger');

describe('Temperature socket: integration', () => {
	let _socketClient: socketIoServer.Socket;
	let _socketServer: socketIoServer.Server;

	beforeEach(() => {
		_socketServer = socketIoServer.listen(1339);
		_socketClient = socketIoClient.connect('http://0.0.0.0:1339/temperature');
		temperature(_socketServer);
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
					.some((nsp) => _socketServer.nsps[nsp].name === '/temperature')
			).toBe(true);

			done();
		});
	});

	it('should emit the temperature on connect', (done: () => void) => {
		_socketClient.once('connect', () => {
			_socketClient.once('get', (msg) => {
				expect(msg).toEqual({
					data: [
						{
							id: 'a1',
							date: '2018-12-02',
							temperature: '42',
						},
					],
				});

				done();
			});
		});
	});
});
