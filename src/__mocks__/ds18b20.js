let mockError = null;
let mockIds = [];

const _setMockError = (error) => {
	mockError = error;
};

const _setMockIds = (ids) => {
	mockIds = ids;
};

const sensors = (callback) => {
	callback(mockError, mockIds);
};

const temperatureSync = (id, options = {}) => {
	return 42;
};

module.exports = {
	_setMockError,
	_setMockIds,
	sensors,
	temperatureSync,
};
