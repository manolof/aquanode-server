import { Job } from 'node-schedule';
import { LightsStatus } from './lights/interfaces';
import { BaseSchedule } from './schedule';

jest.mock('./logger');

const mockScheduleConfig = [
	{
		time: {
			hour: 0,
			minute: 0
		},
		state: 'on' as any,
	},
	{
		time: {
			hour: 7,
			minute: 0
		},
		state: 'off' as any,
	},
];

const [firstJob, secondJob] = mockScheduleConfig;

const mockScheduleJobs = {
	[`0: ${firstJob.state}`]: expect.any(Job),
	[`1: ${secondJob.state}`]: expect.any(Job),
};

class MockNamespaceClass {
	public static setState() {
		//
	}
}

const TestSchedule = new BaseSchedule(MockNamespaceClass, mockScheduleConfig);

describe('Schedule', () => {
	const setStateSpy = jest.spyOn(MockNamespaceClass, 'setState');

	describe('getSchedules', () => {
		it('should get the schedules', () => {
			expect(TestSchedule.getSchedules()).toEqual({});
		});
	});

	describe('init', () => {
		it('should set the schedules', () => {
			TestSchedule.init();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs);
		});

		it('should start the closest schedule event in the past from current time', () => {
			const beforeOn = new Date().setHours(0, 59, 0, 0);
			const afterOn = new Date().setHours(7, 1, 0, 0);

			Date.now = jest.fn(() => beforeOn);

			TestSchedule.init();
			expect(setStateSpy).toHaveBeenLastCalledWith(firstJob.state);

			Date.now = jest.fn(() => afterOn);

			TestSchedule.init();
			expect(setStateSpy).toHaveBeenLastCalledWith(secondJob.state);
		});
	});

	describe('forceSchedule', () => {
		it('should force a new schedule', () => {
			TestSchedule.init();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs);

			TestSchedule.forceSchedule(LightsStatus.off);
			expect(TestSchedule.getSchedules()).toEqual({});
			expect(setStateSpy).toHaveBeenLastCalledWith(LightsStatus.off);
		});
	});

	describe('resetSchedule', () => {
		it('should reset the schedule and start new', () => {
			TestSchedule.forceSchedule(LightsStatus.off);
			expect(TestSchedule.getSchedules()).toEqual({});

			TestSchedule.resetSchedule();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs);

		});
	});

});
