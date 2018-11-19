import * as http from 'http';
import * as socketIo from 'socket.io';

import { LightsSchedule } from './lights/schedule';
// import { RelaySchedule } from './relay/schedule';
import { schedule } from './routes/schedule';
import { status } from './routes/status';
import { TemperatureSensor } from './temperature-sensor/temperature-sensor';

const app: http.Server = http.createServer();
const socketIoServer: socketIo.Server = socketIo(app);

runSchedules();
handleSockets(socketIoServer);

function runSchedules() {
	LightsSchedule.init();
	// TemperatureSensor.init();
	// RelaySchedule.init();
}

function handleSockets(_socketIoServer: socketIo.Server) {
	status(_socketIoServer);
	schedule(_socketIoServer);
}

export {
	app,
};
