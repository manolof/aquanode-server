import * as socketIo from 'socket.io';

import { temperatureLogCollection } from '../../conf/firebase';
import { logger } from '../logger';

export function temperature(socketServer: socketIo.Server) {
	socketServer
		.of('recentTemperatures')
		.on('connection', async (clientSocket: socketIo.Socket) => {
			logger.debug('Serving the temperature');

			await onGet(clientSocket);

			clientSocket.on('disconnect', () => {
				logger.debug('Temperature client disconnected');
			});
		});
}

async function onGet(clientSocket: socketIo.Socket) {
	const collectionSnapshot = await temperatureLogCollection
		.limit(200)
		.orderBy('date', 'desc')
		.get();

	clientSocket.emit('get', {
		data: collectionSnapshot.docs.map((doc) => {
			/* tslint:disable:no-shadowed-variable */
			const { date, temperature } = doc.data();
			/* tslint:enable:no-shadowed-variable */

			const dateObj = date.toDate();

			return {
				date: dateObj,
				temperature,
			};
		}),
	});
}
