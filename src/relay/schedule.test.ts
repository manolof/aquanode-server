import { BaseSchedule } from '../schedule';
import { Relay } from './relay';
import { RelaySchedule } from './schedule';

jest.mock('../schedule');
jest.mock('./relay');

describe('RelaySchedule', () => {
	const relaySetState = jest.spyOn(Relay, 'setState');

	// @ts-ignore
	const scheduleSetSchedules = jest.spyOn(BaseSchedule, 'setSchedules');
	// @ts-ignore
	const scheduleStartClosestPastEvent = jest.spyOn(BaseSchedule, 'startClosestPastEvent');

	describe('init', () => {
		it(`should initialize the relay's schedule`, () => {
			RelaySchedule.init();

			// @ts-ignore
			expect(scheduleSetSchedules)
				.toHaveBeenCalledWith(expect.any(Array), expect.any(Function));

			// @ts-ignore
			expect(scheduleStartClosestPastEvent)
				.toHaveBeenCalledWith(expect.any(Array), expect.any(Function));

			expect(relaySetState).toHaveBeenCalledTimes(2);
		});
	});
});
