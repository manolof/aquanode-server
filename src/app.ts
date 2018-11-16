import * as http from 'http';
import * as socketIo from 'socket.io';

import { LightsSchedule } from './lights/schedule';
import { logger } from './logger';
// import { RelaySchedule } from './relay/schedule';
import { schedule } from './routes/schedule';
import { status } from './routes/status';
import { TemperatureSensor } from './temperature-sensor/temperature-sensor';

const app: http.Server = http.createServer();
const io: socketIo.Server = socketIo(app);

runSchedules();

io.on('connection', (socket: socketIo.Socket) => {

	logger.info('client connected: ', socket.id);

	handleSockets(socket);

	socket.on('disconnect', () => {
		logger.info('client disconnected: ', socket.id);
	});

	socket.on('error', (err) => {
		logger.error('received error from client: ', socket.id);
		logger.error(err);
	});
});

function handleSockets(socket: socketIo.Socket) {
	status(socket);
	schedule(socket);
}

function runSchedules() {
	LightsSchedule.init();
	// TemperatureSensor.init();
	// RelaySchedule.init();
}

export {
	app,
};
