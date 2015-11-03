import ArticleCollection from './../article/ArticleCollection';
import ArticleModel from './../article/ArticleModel';
import Path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import Bluebird from 'bluebird';
import FrontMatter from 'front-matter';
import Lowerdash from 'lowerdash';

export default function(Writenode){
	let articles = new ArticleCollection,
		readFile = Bluebird.promisify(fs.readFile),
		readdir = Bluebird.promisify(fs.readdir),
		{ timestamp, getService } = Writenode,
		watcher = getService('watcher'),
		{ pathToBlog, defaultTemplates, pathToTheme } = getService('conf');

	articles.setDefaultTemplates(defaultTemplates, pathToTheme);

	function parseMarkdown(rawMarkdown, filePath){
		let { attributes, body } = FrontMatter(rawMarkdown);

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
		}

		return attributes;
	}

	function createArticle(attributes){
		let article = new ArticleModel;

		article.on('change:tags', article => {
			articles.addTags(article.get('tags'));
		});

		article.set(attributes);

		return article;
	}

	function setArticleTemplates(attributes){
		let defaultTemplates = articles.getDefaultTemplates('article');

		if(attributes.templates){
			let articleTemplates = articles.setTemplatesPath(attributes.templates, pathToTheme);

			Lowerdash.assign(attributes.templates, defaultTemplates, articleTemplates);
		} else {
			attributes.templates = defaultTemplates;
		}
	}

	function cache(){

	}

	function handleFileChange(filePath){
		// console.info('UPDATE ARTICLE: ', filePath);

		if(/\/data\.md$/.test(filePath)){
			return readFile(filePath, {
					encoding: 'utf-8'
				})
				.catch(error => console.error(error))
				.then(rawMarkdown => {
					let attributes = parseMarkdown(rawMarkdown, Path.relative(pathToBlog, filePath));
					setArticleTemplates(attributes);

					articles.add(createArticle(attributes), {
						merge: true
					});
				});

		// } else {
		// 	console.info(filePath)
		}
	}

	return watcher.addChangeHandler([
		// pathToBlog + '/data/**/data.md'
		pathToBlog + '/data/**/*'
	], path => handleFileChange(path))
		.then(a => articles);
}
