import { scheduledJobs } from 'node-schedule';
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

const mockScheduleJobs = () => {
	return mockScheduleConfig.map((schedule) => {
		const jobName = `${schedule.state}-${schedule.time.hour}:${schedule.time.minute}`;

		return {
			job_name: jobName,
			job_next_run: scheduledJobs[jobName].nextInvocation(),
		};
	});
};

class TestSchedule extends BaseSchedule {
	public static mockFunction(...params) {
		// nothing to do here
	}

	public static _startClosestPastEvent() {
		this.startClosestPastEvent(mockScheduleConfig, (callback: any) => {
			TestSchedule.mockFunction('startClosestPastEvent fired', callback);
		});
	}

	public static _setSchedules() {
		this.setSchedules(mockScheduleConfig, (callback: any) => {
			// nothing to do here
		});
	}

	public static _cancelAllJobs(): void {
		this.cancelAllJobs();
	}
}

describe('Schedule', () => {
	describe('getSchedules', () => {
		it('should get the schedules', () => {
			expect(TestSchedule.getSchedules()).toEqual([]);
		});
	});

	describe('setSchedules', () => {
		it('should set the schedules', () => {
			TestSchedule._setSchedules();
			expect(TestSchedule.getSchedules()).toEqual(mockScheduleJobs());
		});
	});

	describe('startClosestPastEvent', () => {
		jest.spyOn(TestSchedule, 'mockFunction');

		const realDateNow = Date.now;

		afterAll(() => {
			Date.now = realDateNow;
		});

		it('should start the closest schedule event in the past from current time', () => {
			const beforeOn = new Date().setHours(0, 59, 0, 0);
			const afterOn = new Date().setHours(7, 1, 0, 0);

			Date.now = jest.fn(() => beforeOn);

			TestSchedule._startClosestPastEvent();
			expect(TestSchedule.mockFunction).toHaveBeenCalledWith(expect.any(String), 'on');

			Date.now = jest.fn(() => afterOn);

			TestSchedule._startClosestPastEvent();
			expect(TestSchedule.mockFunction).toHaveBeenCalledWith(expect.any(String), 'off');
		});
	});

	describe('cancelAllJobs', () => {
		it('should cancel all scheduled jobs', () => {
			TestSchedule._cancelAllJobs();
			expect(TestSchedule.getSchedules()).toEqual([]);
		});
	});

});
