import { toArray } from 'lowerdash';
import Path from 'path';
import Bluebird from 'bluebird';

import watcher from './services/watcher';
import conf from './services/conf';
import medias from './services/medias';
import articles from './services/articles';
import views from './services/views';
import server from './services/server';
import assets from './services/assets';

let services = {};

// import fs from 'fs-extra';

var timer = {};

timestamp('start');

function timestamp(label){
	timer[label] = Date.now();
}

var ready = false;
export function isReady(){
	return ready;
}

export function addService(name, service, ...args){
	if(services[name]){
		return Bluebird.resolve(services[name]);
	}

	args.unshift({
		isReady,
		addService,
		getService,
		timestamp
	});

	return service(...args)
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
		.then(() => addService('medias', medias))
		.then(() => addService('articles', articles))
		.then(() => addService('assets', assets))
		.then(() => addService('views', views))
		.then(() => addService('server', server))
		.then(() => {
			timestamp('end');
			console.info(timer, (timer.end - timer.start) + 'ms');
			ready = true;

			// return fs.outputJson(Path.join(getService('conf').pathToBlog, 'data.json'), getService('articles').toJSON());
		});
}
