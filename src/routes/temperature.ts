import * as socketIo from 'socket.io';

import { temperatureLogCollection } from '../../conf/firebase';
import { logger } from '../logger';

export function temperature(socketServer: socketIo.Server) {
	socketServer
		.of('temperature')
		.on('connection', async (clientSocket: socketIo.Socket) => {
			logger.info('Serving the temperature');

			await onGet(clientSocket);

			clientSocket.on('disconnect', () => {
				logger.info('Temperature client disconnected');
			});
		});
}

async function onGet(clientSocket: socketIo.Socket) {
	logger.debug('emitting temperature...');

	const collectionSnapshot = await temperatureLogCollection.get();

	clientSocket.emit('get', {
		data: collectionSnapshot.docs.map((doc) => {
			/* tslint:disable:no-shadowed-variable */
			const { date, temperature } = doc.data();
			/* tslint:enable:no-shadowed-variable */

			const dateObj = date.toDate();

			return {
				id: doc.id,
				date: dateObj,
				temperature,
			};
		}),
	});
}
