import imageinfo from 'imageinfo';
import Bluebird from 'bluebird';
import fs from 'fs';
import lodash from 'lodash';
import Path from 'path';

export default function(Writenode){
	let watcher = Writenode.getService('watcher'),
		readFile = Bluebird.promisify(fs.readFile),
		readdir = Bluebird.promisify(fs.readdir),
		{ timestamp, getService } = Writenode,
		{ pathToBlog, defaultTemplates, pathToTheme } = getService('conf');

	function getInfo(path){
		return readFile(path)
			.then(data => imageinfo(data))
			.catch(error => console.error('Error reading file ' + path, error));
	}

	function resize(){

	}

	function handleFileChange(path){
		var articlePath = Path.basename(Path.dirname(path)),
			article = getService('articles').get(articlePath);

		return getInfo(path)
			.then(info => {
				let { width, height } = info,
					filename = Path.basename(path), // id = filename
					media = lodash(article.get('medias')).find({ url: filename });

				if(!media){
					media = { id: filename };
				}

				var rawMedia = {
					provider: 'local',
					type: 'image',
					url: Path.join('/', articlePath, filename),
					caption: media.caption,
					width,
					height,
					id: media.id,
				};

				article
					.get('mediaCollection').add(rawMedia, {
						merge: true
					});
			});
	}

	return watcher.addChangeHandler([
		pathToBlog + '/data/**/*.jpg',
		pathToBlog + '/data/**/*.jpeg',
		pathToBlog + '/data/**/*.gif',
		pathToBlog + '/data/**/*.png',
	], path => handleFileChange(path));
}
