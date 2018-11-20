import { LightsSchedule } from '../lights/schedule';
import { schedule } from './schedule';

jest.mock('socket.io');
jest.mock('../lights/schedule', () => ({
	LightsSchedule: {
		getSchedules: () => {
			return [];
		},
		forceSchedule: (...params) => {
			//
		},
		resetSchedule: (...params) => {
			//
		},
	},
}));
jest.mock('../logger');

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

describe('Schedule sockets', () => {
	const lightsForceSchedule = jest.spyOn(LightsSchedule, 'forceSchedule');
	const lightsResetSchedule = jest.spyOn(LightsSchedule, 'resetSchedule');

	it('should set up sockets', () => {
		schedule(mockSocketIoServer as any);

		// Namespace
		expect(mockSocketIoServer.of).toHaveBeenCalledWith('schedule');

		// on namespace connection
		expect(mockNamespaceOn).toHaveBeenCalledWith('connection', expect.any(Function));

		// on socket get
		expect(mockEmitSocketEventCallback).toHaveBeenNthCalledWith(1, 'get', {
			data: [],
		});

		// on socket set
		expect(mockOnSocketEventCallback).toHaveBeenCalledWith('set', expect.any(Function));
		expect(lightsForceSchedule).toHaveBeenCalled();

		// on socket reset
		expect(mockOnSocketEventCallback).toHaveBeenCalledWith('reset', expect.any(Function));
		expect(lightsResetSchedule).toHaveBeenCalled();

		expect(mockOnSocketEventCallback).toHaveBeenCalledWith('disconnect', expect.any(Function));

		expect(mockEmitSocketEventCallback).toHaveBeenCalledTimes(3);
	});
});
