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
	templates = {};
	tags = [];

	initialize(){
		this.on('add', article => {
			article.on('change:tags', article => {
				this.addTags(article.get('tags'));
			});

			article.set('template', this.getTemplate('article'));
		});
	}

	addTags(tags){
		var previousTags = this.tags;

		this.tags = Lowerdash(this.tags)
			.union(tags)
			.uniq()
			.sort()
			.value();

		if(previousTags != this.tags){
			this.trigger('changetag', this.tags);
			console.info('\nARTICLE COLLECTION ADD TAGS\n', this.tags);
		}

		return this;
	}

	getTemplate(part){
		return this.templates[part];
	}

	setTemplates(templates){
		Lowerdash.merge(this.templates, templates);
	}

	getPostsTagged(tag){
		var articles = this.filter(article => Lowerdash.contains(article.get('tags'), tag));

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
