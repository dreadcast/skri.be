import Lowerdash from 'lowerdash';
import Path from 'path';
import PageableCollection from 'backbone.paginator';
import ArticleModel from './ArticleModel';

var listArticles = function(articles, properties){
	return Lowerdash.merge({
		articles: articles,
		total: articles.length
	}, properties);
};

export default class ArticleCollection extends PageableCollection {
	model = ArticleModel;
	defaultTemplates = {};
	tags = [];

	// initialize(){
	// 	this.on('add', article => {
	// 		let templates = this.getDefaultTemplates('article');
	//
	// 		article
	// 			.set('templates', templates, {
	// 				silent: true
	// 			})
	// 			.on('change:tags', article => {
	// 				this.addTags(article.get('tags'));
	// 			})
	// 			.on('change:templates', article => {
	// 				let articleTemplates = this.setTemplatesPath(article.get('templates'), 'mmm/mmm/mmm');
	//
	// 				Lowerdash.assign(templates, articleTemplates);
	//
	// 				article.set('templates', templates, {
	// 					silent: true
	// 				});
	// 			});
	// 	});
	// }

	addTags(tags){
		var previousTags = this.tags;

		this.tags = Lowerdash(this.tags)
			.union(tags)
			.uniq()
			.sort()
			.value();

		if(previousTags != this.tags){
			this.trigger('changetag', this.tags);
			// console.info('\nARTICLE COLLECTION ADD TAGS\n', this.tags);
		}

		return this;
	}

	getDefaultTemplates(part){
		return Lowerdash.clone(this.defaultTemplates[part]);
	}

	setTemplatesPath(templates, absoluteBasePath){
		return Lowerdash.mapValues(templates, template => {
			if(typeof template == 'string'){
				return Path.join(absoluteBasePath, template);

			} else {
				return template;
			}
		})
	}

	setDefaultTemplates(templates, absoluteBasePath){
		this.defaultTemplates = Lowerdash(this.defaultTemplates)
			.merge(templates)
			.mapValues(type => this.setTemplatesPath(type, absoluteBasePath))
			.value();
	}

	getPostsTagged(tag){
		var articles = this.filter(article => Lowerdash.contains(article.get('tags'), tag));

		return articles;
		return listArticles(articles, {
			tag: tag
		});
	}

	getFeaturedPosts(){
		var items = this.items,
			articles = this.filter(article => article.get('featured'));

		return listArticles(articles);
	}

	sortBy(field){
		var items = this.items,
			articles = Lowerdash.sortBy(items.articles, field);

		return listArticles(articles);
	}

	groupBy(field){
		var items = this.items,
			articles = Lowerdash.groupBy(items.articles, field);

		return listArticles(articles);
	}
}
