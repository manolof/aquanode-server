import { CONFIG } from '../../conf/config';
import { status } from './status';

jest.useFakeTimers();

jest.mock('socket.io');
jest.mock('../../conf/config', () => ({
	CONFIG: {
		logFile: 'log.log',
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

const mockEmitSocketEventCallback = jest.fn();
const mockOnSocketEventCallback = jest.fn().mockImplementation((event, callback) => {
	callback();
});

const mockOnConnectionCallback = jest.fn().mockImplementation(() => ({
	on: mockOnSocketEventCallback,
	emit: mockEmitSocketEventCallback,
}));

const mockNamespaceOn = jest.fn().mockImplementation((event, callback) => {
	callback(mockOnConnectionCallback());
});

const mockSocketIoServer = {
	of: jest.fn().mockImplementation(() => ({
		on: mockNamespaceOn,
	})),
};

describe('Status sockets', () => {
	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should set up sockets', () => {
		status(mockSocketIoServer as any);

		// Namespace
		expect(mockSocketIoServer.of).toHaveBeenCalledWith('status');

		// on namespace connection
		expect(mockNamespaceOn).toHaveBeenCalledWith('connection', expect.any(Function));

		jest.advanceTimersByTime(CONFIG.socketEmitInterval);

		// on socket get
		expect(mockEmitSocketEventCallback).toHaveBeenCalledWith('get', {
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
				],
			},
		});

		expect(mockOnSocketEventCallback).toHaveBeenCalledWith('disconnect', expect.any(Function));

		expect(mockEmitSocketEventCallback).toHaveBeenCalledTimes(1);
	});
});
