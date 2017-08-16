const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const schedule = require('./schedule');
const logger = require('./logger');
const api = require('./routes/api');

const app = express();
const config = schedule.getConfig();

const allowCrossDomain = (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', '..', 'aquanode-client', 'dist')));

app.use(allowCrossDomain);

app.use('/api', api);

const server = app.listen(config.port || 80, () => {
	const port = server.address().port;
	logger.info('Aquarium control server listening on port ' + port);
});
