import { toArray } from 'lowerdash';
import Path from 'path';
import Bluebird from 'bluebird';

import watcher from './services/watcher';
import conf from './services/conf';
import articles from './services/articles';
import views from './services/views';
import server from './services/server';
import assets from './services/assets';

let services = {};

var timer = {};

timestamp('start');

function timestamp(label){
	timer[label] = Date.now();
}

export function addService(name, service, ...args){
	if(services[name]){
		return Bluebird.resolve(services[name]);
	}

	args.unshift({
		addService,
		getService,
		timestamp
	});

	return service.apply(this, args)
		.then(serviceData => {
			services[name] = serviceData;

			return serviceData;
		});
}

export function getService(name){
	return services[name];
}

export function dev(pathToTheme){
	return addService('conf', conf, pathToTheme)
		.then(() => addService('watcher', watcher))
		.then(() => addService('articles', articles))
		.then(() => addService('assets', assets))
		.then(() => addService('views', views))
		.then(() => addService('server', server))
		.then(() => {
			timestamp('end');
			console.info(timer, (timer.end - timer.start) + 'ms');
		});
}
