import { join } from 'path';
import open from 'open';
import express from 'express';
import logger from './../util/logger';
import { pathToBlog, testPort } from './../conf';
import buildData from './data';
import buildAsset from './asset';

function testServe() {
	const app = express();

	app.use(
		express.static(join(pathToBlog, 'build'))
	);
	app.listen(testPort);

	open('http://localhost:' + testPort);
	logger.info('Testing build on port ', testPort);
}

export default function build(state) {
	return buildData(state)
		.then(buildAsset)
		.then(testServe);
}
