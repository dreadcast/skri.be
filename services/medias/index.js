import local from './local';
import Path from 'path';

export default function(Writenode){
	let { addService, getService } = Writenode;

	function addMedia(article, rawMedia){
		console.info(`ADD MEDIA: "${rawMedia.url}"
	TO ARTICLE: "${article.get('id')}"`);

		return article.get('mediaCollection').add(rawMedia, {
			merge: true
		});
	}

	function process(article, mediaPath){
		if(/^http/.test(mediaPath)){
			console.info('NEED REMOTE MEDIA', mediaPath);

		} else {
			console.info('LOCAL MEDIA', mediaPath);

			return getService('medias/local').process(article, mediaPath);
		}
	}

	return addService('medias/local', local)
		.then(() => {
			return {
				addMedia,
				process
			}
		});
}
