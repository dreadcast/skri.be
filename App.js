import ArticleCollection from './Article/ArticleCollection';
import ArticleModel from './Article/ArticleModel';
import Lowerdash from 'lowerdash';
import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import chokidar from 'chokidar';
import marked from 'marked';
import Promise from 'bluebird';
import FrontMatter from 'front-matter';

var startTime = new Date().getTime();

export default class Writenode {
	options = {
		theme: Path.join(__dirname, 'default/theme'),
		pathToBlog: Path.join(__dirname, 'default')
	}

	constructor(pathToTheme){
		var pathToBlog = this.options.pathToBlog = Path.resolve('.');
		var theme = require(pathToTheme);


		Lowerdash.merge(this.options, theme.config, require(Path.join(pathToBlog, 'package')).config, {
			pathToTheme
		});

		// this.options.theme = pathToTheme ? pathToTheme : Path.join(module.parent.paths[0], themeName);

		var articles = this.articles = new ArticleCollection;
 		this.articles.setTemplates(this.options.templates);

		// this.viewManager = new ViewManager({
		// 	templates: this.options.templates,
		// 	pathToBlog: this.options.pathToBlog,
		// 	defaults: {
		// 		site: this.options.site,
		// 		tags: this.articles.tags
		// 	},
		// 	theme: this.options.theme
		// });
		// console.info(this.articles);

		function md(path){
			return new Promise((resolve, reject) => {
				console.info('\n\n\n\n---------------------\nParsing article ' + path)

				return fs.readFile(Path.join(pathToBlog, 'data', path, 'data.md'), {
					encoding: 'utf-8'
				}, (error, data) => {
					if(error){
						return reject(error);

					} else {
						return resolve(data);
					}
				});
			})
			.catch(error => console.error(error))
			.then(rawMarkdown => {
				let { attributes, body } = FrontMatter(rawMarkdown);

				if(typeof attributes.tags == 'string'){
					attributes.tags = attributes.tags.split(/,\s?/);
				}

				attributes.id = path;
				var parsedContent = body.match(/#(.*)\n/);

				if(parsedContent){
					attributes.title = parsedContent[1];
					attributes.content = marked(parsedContent.input.replace(parsedContent[0], ''));

				} else {
					attributes.content = body;
				}

				var article = new ArticleModel({
						id: path
					}, {
						pathToBlog
					})
					.set(attributes);

				articles.add(article);

			//
			// 	return article.getMedias();
			// })
			// .then(medias => {
				console.info('---------------------\n\n\n\n\n\n');

				return Promise.resolve(1);
			});
		}

		var paths = [
			'55x55',
			// 'aberto-studio-ar-arquitetos',
			// 'family-house-dlhe-diely-i',
			// 'ein-mann-sauna',
		];
		Promise.each(paths, md);

		return this;
	}

	start(cb){
		_.eachAsync(['startServer', 'loadArticles'], function(fn, i, cursor, arr){
			this[fn](cursor);

			console.info(fn + '... done');
		}, function(){
			var duration = Math.round(((new Date().getTime() - startTime) / 1000) * 10) / 10;

			console.info('Blog ready in ' + duration + ' sec !');

			cb.call(this);

		}, this);
	}

	build(){
		return this.loadArticles(require('./build/build').bind(this));
	}

	loadArticles(cb){
		var absPath = Path.join(this.options.pathToBlog, 'data');
		recurse(absPath, function(path, filename, type, cursor){
			if('data.md' == filename){
				var article = new ArticleModel({
					id: Path.relative(absPath, path),
					template: this.options.templates.article
				}, {
					pathToBlog: this.options.pathToBlog
				});

				this.articles.add(article);

				article.on('change:tags', function(data){
					this.articles.addTags(article.get('tags'));
				}.bind(this));

				article.parse(Path.join(path, filename), cursor);

			} else {
				setTimeout(cursor, .1);
			}
		}.bind(this), function(){
			console.info('Articles loaded')
			cb();
		}.bind(this));
	}

	startServer(cb){
		watcher.call(this);

		var Server = require('./Base/Server'),
			options = {};

		_.merge(options, this.options, {
			articleCtrl: this.articles,
			viewManager: this.viewManager
		});

		this.server = new Server(options);

		setTimeout(cb, .1);
	}
};
