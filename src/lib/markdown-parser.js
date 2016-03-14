import FrontMatter from 'front-matter';
import { assoc, map } from 'ramda';
import logger from './../util/logger';

import md from 'markdown-it';
import illuminate from 'illuminate-js';
import emoji from 'markdown-it-emoji';
import checkbox from 'markdown-it-checkbox';
import mark from 'markdown-it-mark';
import fn from 'markdown-it-footnote';

import { PATH_TO_BLOG } from './../conf';
import { formatMedia } from '../modules/media/MediaActions';

var mdOptions = {
		highlight: function (str, lang) {
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

function setTags(attributes) {
	var tags = attributes.tags;

	if(typeof attributes.tags == 'string'){
		tags = attributes.tags.split(/,\s?/);

	} else if(!attributes.tags) {
		tags = [];
	}

	return assoc('tags', tags, attributes);
}

function setId(path, attributes) {
	var id = path
		.replace(PATH_TO_BLOG + '/data/', '')
		.replace('/data.md', '');

	return assoc('id', id, attributes);
}

function setContent(body, attributes) {
	var content,
		parsedContent = body.match(/#(.*)\n/);

	if(parsedContent){
		attributes = assoc('title', parsedContent[1], attributes);
		content = parser.render(parsedContent.input.replace(parsedContent[0], ''));

	} else {
		content = body;
	}

	return assoc('content', content, attributes);
}

function setMedias(attributes) {
	return assoc('medias', map(formatMedia, attributes.medias || []), attributes);
}

function setTemplates(attributes) {
	return assoc('templates', attributes.templates || {}, attributes);
}

export default function parseMarkdown(rawMarkdown, path){
	let { attributes, body } = FrontMatter(rawMarkdown);

	attributes = setTags(attributes);
	attributes = setId(path, attributes);
	attributes = setContent(body, attributes);
	// attributes = setTemplates(attributes);

	return setMedias(attributes);
}
