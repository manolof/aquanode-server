const express = require('express');
const router = express.Router();

const schedule = require('../schedule.js');
const logger = require('../logger.js');

/* GET api listing. */
router.get('/', (req, res) => {
	res.send('it works');
});

router.get('/schedule', function(req, res) {
	logger.info('Serving the schedule to the web client');
	res.send(schedule.getSchedule());
});

router.post('/schedule', function(req, res) {
	logger.info('Updating the schedule from the web client');
	schedule.setSchedule(req.body);
	res.send(schedule.getSchedule());
});

router.get('/status', function(req, res) {
	const status = schedule.getStatus();
	const clonedStatus = {};
	for (const p in status) {
		if (status.hasOwnProperty(p)) {
			clonedStatus[p] = status[p];
		}
	}
	clonedStatus.time = Date.now();
	res.send(clonedStatus);
});


module.exports = router;
