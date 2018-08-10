import { logger } from './logger';
import { Status } from './status';

jest.mock('./logger');

describe('Status', () => {
	let mockStatus: Status;

	beforeAll(() => {
		mockStatus = new Status('mock1');
	});

	it('should set the status for a particular item', () => {
		mockStatus.set('ON');
		expect(logger.info).toHaveBeenCalledWith('Setting the mock1 to state "ON"');
	});

	it('should get the status for a particular item', () => {
		mockStatus.set('START');
		expect(mockStatus.get()).toBe('START');
	});
});
