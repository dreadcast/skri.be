import { toArray } from 'lowerdash';
import Path from 'path';
import Bluebird from 'bluebird';

import conf from './services/conf';
import articles from './services/articles';
import views from './services/views';
import server from './services/server';
import assets from './services/assets';

let services = {};


export function addService(name, service){
	let args = toArray(arguments).slice(2);

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
		.then(() => addService('assets', assets))
		.then(() => addService('views', views))
		.then(() => addService('server', server));
}
