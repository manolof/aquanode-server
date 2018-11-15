import { Interval } from './interval';

jest.useFakeTimers();

describe('Interval', () => {
	const framerate = 300;
	const mockFnMethod = jest.fn();
	const interval = new Interval(
		mockFnMethod,
		framerate,
	);

	afterAll(() => {
		mockFnMethod.mockReset();
		jest.clearAllTimers();
	});

	describe('start', () => {
		it('should start the interval', () => {
			interval.start();

			expect(setInterval).toHaveBeenCalledTimes(1);
			expect(setInterval).toHaveBeenCalledWith(mockFnMethod, framerate);

			expect(mockFnMethod).not.toHaveBeenCalled();

			jest.advanceTimersByTime(framerate);

			expect(mockFnMethod).toHaveBeenCalled();
		});

		it('should not start another interval if one is running already', () => {
			interval.start();

			expect(setInterval).toHaveBeenCalledTimes(1);
		});
	});

	describe('stop', () => {
		it('should stop the interval', () => {
			interval.stop();

			expect(clearInterval).toHaveBeenCalled();
		});
	});

});
