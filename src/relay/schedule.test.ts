import { BaseSchedule } from '../schedule';
import { RelaySchedule } from './schedule';

jest.mock('../schedule');
jest.mock('./relay');

describe('RelaySchedule', () => {
	it('should be an instance of BaseSchedule', () => {
		expect(RelaySchedule).toBeInstanceOf(BaseSchedule);
	});
});
