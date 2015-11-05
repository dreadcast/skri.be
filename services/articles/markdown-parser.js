import FrontMatter from 'front-matter';
import marked from 'marked';
import Lowerdash from 'lowerdash';

export function parseMarkdown(rawMarkdown, filePath){
	let { attributes, body } = FrontMatter(rawMarkdown);

	attributes.rawAttributes = Lowerdash.clone(attributes);
	attributes.markdown = body;

	if(typeof attributes.tags == 'string'){
		attributes.tags = attributes.tags.split(/,\s?/);
	}

	attributes.id = filePath.replace('data/', '').replace('/data.md', '');
	var parsedContent = body.match(/#(.*)\n/);

	if(parsedContent){
		attributes.title = parsedContent[1];
		attributes.content = marked(parsedContent.input.replace(parsedContent[0], ''));

	} else {
		attributes.content = body;
	}

	if(attributes.medias){
		attributes.medias.forEach((media, index) => {
			if(!media.id){
				if(media.url){
					media.id = media.url;

				} else {
					attributes.medias[index] = {
						id: media,
						url: media
					}
				}
			}
		});

	} else {
		attributes.medias = [];
	}

	return attributes;
}
