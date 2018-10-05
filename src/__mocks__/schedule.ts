class BaseSchedule {
	public static getSchedules() {
		//
	}

	public static startClosestPastEvent(schedule, callback) {
		callback();
	}

	public static setSchedules(schedule, callback) {
		callback();
	}

	public static cancelAllJobs() {
		//
	}

	public static getClosestPastSchedule(schedule) {
		//
	}
}

module.exports = {
	BaseSchedule,
};
