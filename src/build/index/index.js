import { join } from 'path';
import Bluebird from 'bluebird';
import fs from 'fs-extra';
import CONF from './../../conf';

const outputJson = Bluebird.promisify(fs.outputJson);

export default function buildIndex(index) {
	return outputJson(join(CONF.pathToBlog, 'build/index.json'), index);
}
