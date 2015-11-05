import ArticleCollection from './../../article/ArticleCollection';
import ArticleModel from './../../article/ArticleModel';
import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import { parseMarkdown } from './markdown-parser';
import Lowerdash from 'lowerdash';

export default function(Writenode){
	let articles = new ArticleCollection,
		readFile = Bluebird.promisify(fs.readFile),
		readdir = Bluebird.promisify(fs.readdir),
		{ timestamp, getService } = Writenode,
		watcher = getService('watcher'),
		{ pathToBlog, defaultTemplates, pathToTheme } = getService('conf');

	articles.setDefaultTemplates(defaultTemplates, pathToTheme);

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

	function handleFileChange(filePath){
		try{
			var articlePath = filePath.match(/\/data\/(.*)\/.*$/)[1];
		} catch(e){
			console.info('UNHANDLED FILE', filePath);
		}

		console.info(`\n\nCHANGE FILE: ${articlePath}/${Path.basename(filePath)}`);

		if(/\/data\.md$/.test(filePath)){
			return readFile(filePath, {
					encoding: 'utf-8'
				})
				.catch(error => console.error(error))
				.then(rawMarkdown => {
					let attributes = parseMarkdown(rawMarkdown, Path.relative(pathToBlog, filePath));
					setArticleTemplates(attributes);

					return articles.add(createArticle(attributes), {
						merge: true
					});
				})
				.then(article => {
					return getService('medias').processedRawMedias(
						article,
						Path.dirname(filePath),
						article.get('medias')
					)
						.then(medias => article);
				})
				.then(article => {
					// add medias files...
					return getService('medias/local').processQueue(article, articlePath);
				});

		} else {
			// if article is not ready then push its media to medias queue
			getService('medias/local').pushMedia(articlePath, filePath);
		}
	}

	return watcher.addChangeHandler([
		pathToBlog + '/data/**/*'
	], path => handleFileChange(path))
		.then(a => articles);
}
