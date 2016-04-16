import FrontMatter from 'front-matter';
import { assoc, map, pipe, mapObjIndexed } from 'ramda';
import logger from './../util/logger';
import { getArticleId } from './../util/urlParser';

import md from 'markdown-it';
import illuminate from 'illuminate-js';
import emoji from 'markdown-it-emoji';
import checkbox from 'markdown-it-checkbox';
import mark from 'markdown-it-mark';
import fn from 'markdown-it-footnote';

import { blogTemplatePrefix } from './../conf';
import { formatMedia } from '../modules/media/MediaActions';
import summarize from './curcuma/summarize';

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

function setTags(tags) {
	if(typeof tags == 'string'){
		tags = tags.split(/,\s?/);

	} else if(!tags) {
		tags = [];
	}

	return assoc('tags', tags);
}

function setId(path) {
	return assoc('id', getArticleId(path));
}

function setContent(body) {
	var parsedContent = body.match(/#(.*)\n/);

	if(parsedContent){
		var content = parser.render(parsedContent.input.replace(parsedContent[0], ''));

		return pipe(
			assoc('title', parsedContent[1]),
			assoc('content', content),
			assoc('summary', summarize(content)),
		);
	}

	return assoc('content', body);
}

function setMedias(medias) {
	return assoc('medias', map(formatMedia, medias || []));
}

function setTemplates(templates) {
	templates = mapObjIndexed(template => {
		if(typeof template == 'string'){
			template = blogTemplatePrefix + template;
		}

		return template;
	}, templates || {});

	return assoc('templates', templates);
}

export default function parseMarkdown(rawMarkdown, path){
	let { attributes, body } = FrontMatter(rawMarkdown);

	return pipe(
		setId(path),
		setTags(attributes.tags),
		setMedias(attributes.medias),
		setContent(body),
		setTemplates(attributes.templates),
	)(attributes);
}
