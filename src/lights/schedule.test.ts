import { BaseSchedule } from '../schedule';
import { LightsStatus } from './interfaces';
import { Lights } from './lights';
import { LightsSchedule } from './schedule';

jest.mock('../schedule');
jest.mock('./lights');

describe('LightsSchedule', () => {
	const lightsSetState = jest.spyOn(Lights, 'setState');

	// @ts-ignore
	const scheduleSetSchedules = jest.spyOn(BaseSchedule, 'setSchedules');
	// @ts-ignore
	const scheduleStartClosestPastEvent = jest.spyOn(BaseSchedule, 'startClosestPastEvent');
	// @ts-ignore
	const scheduleCancelAllJobs = jest.spyOn(BaseSchedule, 'cancelAllJobs');

	beforeEach(() => {
		lightsSetState.mockReset();
		scheduleCancelAllJobs.mockReset();
	});

	describe('init', () => {
		it(`should initialize the lights's schedule`, () => {
			LightsSchedule.init();

			// @ts-ignore
			expect(scheduleSetSchedules)
				.toHaveBeenCalledWith(expect.any(Array), expect.any(Function));

			// @ts-ignore
			expect(scheduleStartClosestPastEvent)
				.toHaveBeenCalledWith(expect.any(Array), expect.any(Function));

			expect(lightsSetState).toHaveBeenCalledTimes(2);
		});
	});

	describe('forceSchedule', () => {
		it(`should force a new light's schedule`, () => {
			LightsSchedule.forceSchedule(LightsStatus.day);

			// @ts-ignore
			expect(scheduleCancelAllJobs).toHaveBeenCalled();

			expect(lightsSetState).toHaveBeenLastCalledWith(LightsStatus.day);
			expect(lightsSetState).toHaveBeenCalledTimes(1);
		});
	});

	describe('resetSchedule', () => {
		it(`should reset the light's schedule to the predefined`, () => {
			jest.spyOn(LightsSchedule, 'init');
			LightsSchedule.resetSchedule();

			// @ts-ignore
			expect(scheduleCancelAllJobs).toHaveBeenCalled();

			expect(LightsSchedule.init).toHaveBeenCalled();
		});
	});
});
