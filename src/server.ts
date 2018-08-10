import { app } from './app';
import { logger } from './logger';

/*
The reason behind separating the app and server is that it won’t listen to the port after testing.
 */

app.listen(app.get('port'), () => {
	logger.info(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`);
	logger.info('Press CTRL-C to stop\n');
});
