import images from './images';
import Path from 'path';
import Bluebird from 'bluebird';

export default function(Writenode){
	let { addService, getService } = Writenode,
		mediasQueue = {};

	function pushMedia(articlePath, filePath){
		var article = getService('articles').findWhere({
			id: articlePath
		});

		if(article){
			console.info(`FOUND ARTICLE ${articlePath}`);

			return process(article, filePath)
				.then(rawMedia => getService('medias').addMedia(article, rawMedia))

		} else {
			console.info(`ARTICLE NOT FOUND: ${articlePath}
	PUSH: "${articlePath}/${Path.basename(filePath)}"
	TO: "${articlePath}" MEDIA QUEUE`);

			if(!mediasQueue[articlePath]){
				mediasQueue[articlePath] = [];
			}

			mediasQueue[articlePath].push(filePath);
		}
	}

	function processQueue(article, articlePath){
		return Bluebird.map(mediasQueue[articlePath], mediaPath => {
			return process(article, mediaPath)
				.then(rawMedia => getService('medias').addMedia(article, rawMedia))
		});
	}

	function process(article, mediaPath){
		var ext = Path.extname(mediaPath);

		switch (ext) {
			case '.jpg':
			case '.jpeg':
			case '.gif':
			case '.png':
				return getService('medias/local/images').process(article, mediaPath);

			default:
				console.info('Unhandled file', mediaPath);

				return { mediaPath, article };
		}
	}

	return addService('medias/local/images', images)
		.then(() => {
			return {
				pushMedia,
				processQueue,
				process
			}
		});
}
