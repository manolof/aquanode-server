import { BaseSchedule } from '../schedule';
import { LightsSchedule } from './schedule';

jest.mock('../schedule');
jest.mock('./lights');

describe('LightsSchedule', () => {
	it('should be an instance of BaseSchedule', () => {
		expect(LightsSchedule).toBeInstanceOf(BaseSchedule);
	});
});
