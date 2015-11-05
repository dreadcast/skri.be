import local from './local';
import remote from './remote';
import Path from 'path';
import Bluebird from 'bluebird';
import { merge } from 'lowerdash';

export default function(Writenode){
	let { addService, getService } = Writenode;

	function addMedia(article, rawMedia){
		console.info(`ADD MEDIA: "${rawMedia.url}"
	TO ARTICLE: "${article.get('id')}"`);

		return article.get('mediaCollection').add(rawMedia, {
			merge: true
		});
	}

	function processedRawMedias(article, dirname, rawMedias){
		return Bluebird.map(rawMedias, rawMedia => {
			addMedia(article, rawMedia);

			var url = rawMedia.url;

			if(!/^http/.test(rawMedia.url)){
				url = Path.join(dirname, rawMedia.url);
			}

			return process(article, url)
				.then(processedRawMedia => {
					var mergedRawMedia = merge(processedRawMedia, rawMedia);

					addMedia(article, mergedRawMedia)
				})
		})
	}

	function process(article, mediaPath){
		var service;

		if(/^http/.test(mediaPath)){
			service = getService('medias/remote');

		} else {
			service = getService('medias/local');
		}

		return service.process(article, mediaPath);
	}

	return addService('medias/local', local)
		.then(() => addService('medias/remote', remote))
		.then(() => {
			return {
				processedRawMedias,
				addMedia,
				process
			}
		});
}
