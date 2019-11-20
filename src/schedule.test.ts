import { scheduledJobs } from 'node-schedule';
import { ScheduleResponse } from './interfaces';
import { RelayStatus } from './relay/interfaces';
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

const mockScheduleJobs = (): ScheduleResponse[] => {
	return Object.keys(scheduledJobs).map((jobKey: string, i) => {
		return { ...scheduledJobs[jobKey], job_state: mockScheduleConfig[i].state };
	});
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
			expect(TestSchedule.getSchedules()).toEqual([]);
		});
	});

	describe('init', () => {
		it('should set the schedules', () => {
			TestSchedule.init();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs());
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
			TestSchedule.resetSchedule();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs());

			TestSchedule.forceSchedule(RelayStatus.off);
			expect(TestSchedule.getSchedules()).toEqual([]);
			expect(setStateSpy).toHaveBeenLastCalledWith(RelayStatus.off);
		});
	});

	describe('resetSchedule', () => {
		it('should reset the schedule and start new', () => {
			TestSchedule.forceSchedule(RelayStatus.off);
			expect(TestSchedule.getSchedules()).toEqual([]);

			TestSchedule.resetSchedule();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs());

		});
	});

});
