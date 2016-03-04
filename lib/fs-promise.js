import Bluebird from 'bluebird';
import fs from 'fs';

Bluebird.promisifyAll(fs);
export default fs;
