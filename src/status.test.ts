import { logger } from './logger';
import { Status } from './status';

jest.mock('./logger');

describe('Status', () => {
	let mockStatus: Status;
	const mockStatusId = 'mock1';

	beforeAll(() => {
		mockStatus = new Status(mockStatusId);
	});

	it('should set the status for a particular item', () => {
		mockStatus.set('ON');
		expect(logger.info).toHaveBeenCalledWith(`Setting the ${mockStatusId} to "ON"`);
	});

	it('should get the status for a particular item', () => {
		mockStatus.set('START');
		expect(mockStatus.get()).toBe('START');
	});
});
