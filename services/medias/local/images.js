import imageinfo from 'imageinfo';
import Bluebird from 'bluebird';
import fs from 'fs';
import lodash from 'lodash';
import Path from 'path';

export default function(Writenode){
	let readFile = Bluebird.promisify(fs.readFile),
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

	function process(article, path){
		var articlePath = Path.basename(Path.dirname(path));

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

				return rawMedia;
			});
	}

	return Bluebird.resolve({
		process
	});
}
