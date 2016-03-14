import express from 'express';

import logger from './../util/logger';
import serveAsset from './asset';
import serveData from './data';
import { CONF } from './../conf';

const app = express();

export function start(){
	app.get('/asset/*', serveAsset);
	app.get('/*', serveData);

	app.listen(CONF.port, function(){
		logger.log(`${CONF.title}\nServer listening on port ${CONF.port}`);
	});
}

export default {
	start,
}
