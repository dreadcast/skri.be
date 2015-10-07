import { merge } from 'lowerdash';
import Path from 'path';
import Bluebird from 'bluebird';

export default function(Writenode, pathToTheme){
    let services = {},
    	conf = {},
    	defaultConf = {
    		theme: Path.join(__dirname, 'default/theme'),
    		// pathToBlog: Path.join(__dirname, 'default')
    		pathToBlog: Path.resolve('.')
    	},
		theme = require(pathToTheme);

    pathToTheme = Path.dirname(pathToTheme);

	conf = merge({ pathToTheme }, defaultConf);

	merge(conf, defaultConf, theme.config, require(Path.join(conf.pathToBlog, 'package')).config, {
		pathToTheme
	});

    return Bluebird.resolve(conf);
}
