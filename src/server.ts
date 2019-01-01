import { CONFIG } from '../conf/config';
import { app } from './app';
import { logger } from './logger';

/*
The reason behind separating the app and server is that it won’t listen to the port after testing.
 */

app.listen(CONFIG.port, () => {
	logger.info(`App is running at http://localhost:${CONFIG.port} in ${process.env.NODE_ENV} mode`);
});
