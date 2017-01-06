const path = require('path');
const schedule = require('./schedule.js');
const logger = require('./logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = schedule.getConfig();

const allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
};


app.use(express.static(path.join(__dirname, '..', '..', 'client-dist')));
app.use(bodyParser.json());
app.use(allowCrossDomain);

app.get('/api/schedule', function(req, res) {
	logger.info('Serving the schedule to the web client');
	res.send(schedule.getSchedule());
});

app.post('/api/schedule', function(req, res) {
	logger.info('Updating the schedule from the web client');
	schedule.setSchedule(req.body);
	res.send('ok');
});

app.get('/api/status', function(req, res) {
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

const server = app.listen(config.port || 80, function() {
	const port = server.address().port;
	logger.info('Aquarium control server listening on port ' + port);
});
