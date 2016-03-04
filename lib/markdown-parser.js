import FrontMatter from 'front-matter';
import md from 'markdown-it';
import illuminate from 'illuminate-js';
import emoji from 'markdown-it-emoji';
import checkbox from 'markdown-it-checkbox';
import mark from 'markdown-it-mark';
import fn from 'markdown-it-footnote';
import { pathToBlog } from './../entry.js';

var mdOptions = {
		highlight: function (str, lang) {
			console.log(illuminate.highlight(str, lang));
			// if (lang && illuminate.getLanguage(lang)) {
				return illuminate.highlight(str, lang);
			// }

			return '';
		},
		linkify: true,
		typographer: true,
		quotes: ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'],
	},
	parser = md(mdOptions)
		.use(fn)
		.use(emoji)
		.use(checkbox)
		.use(mark);

export default function parseMarkdown(rawMarkdown, path){
	let { attributes, body } = FrontMatter(rawMarkdown);

	// attributes.markdown = body;

	if(typeof attributes.tags == 'string'){
		attributes.tags = attributes.tags.split(/,\s?/);
	} else if(!attributes.tags) {
		attributes.tags = [];
	}

	attributes.id = path
		.replace(pathToBlog + '/data/', '')
		.replace('/data.md', '');

	var parsedContent = body.match(/#(.*)\n/);

	// if(parsedContent){
	// 	attributes.title = parsedContent[1];
	// 	attributes.content = parser.render(parsedContent.input.replace(parsedContent[0], ''));
	//
	// } else {
	// 	attributes.content = body;
	// }

	if(attributes.medias){
		let index = 0;

		for(var media in attributes.medias) {
			media = attributes.medias[media];

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

			index++;
		}

	} else {
		attributes.medias = [];
	}

	return attributes;
}
