import { toArray } from 'lowerdash';
import Path from 'path';
import Bluebird from 'bluebird';

import conf from './services/conf';
import articles from './services/articles';
import server from './services/server';

let services = {};


export function addService(name, service){
	var args = toArray(arguments).slice(2);
	args.unshift({
		getService: getService
	});

	return service.apply(this, args)
		.then(serviceData => {
			services[name] = serviceData;

			return Promise.resolve(serviceData);
		});
}

export function getService(name){
	return services[name];
}

export function dev(pathToTheme){
	return addService('conf', conf, pathToTheme)
		.then(() => addService('articles', articles))
		.then(() => addService('server', server));
	// addService('viewManager', viewManager);
	// addService('assetWatcher', assetWatcher);
	// addService('devServer', devServer);
}
