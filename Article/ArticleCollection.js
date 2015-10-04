import Lowerdash from 'lowerdash';
import Path from 'path';
import PageableCollection from 'backbone.paginator';
// import ArticleModel from './Model';

var listArticles = function(articles, properties){
	return Lowerdash.merge({
		articles: articles,
		total: articles.length
	}, properties);
};

export default class ArticleCollection extends PageableCollection {
	// model: ArticleModel,

	initialize(){
		this.on('add', function(model){
			model.set('template', this.getTemplate('article'));
		});
	}

	templates = {}

	tags = []

	addTags(tags){
		var previousTags = this.tags;

		this.tags = Lowerdash(this.tags)
			.union(tags)
			.uniq()
			.sort()
			.value();

		if(previousTags != this.tags)
			this.trigger('changetag', this.tags);

		return this;
	}

	getTemplate(part){
		return this.templates[part];
	}

	setTemplates(templates){
		Lowerdash.merge(this.templates, templates);
	}

	getPostsTagged(tag){
		var articles = this.filter(function(article){
			return Lowerdash.contains(article.get('tags'), tag);
		});

		return listArticles(articles, {
			tag: tag
		});
	}

	getFeaturedPosts(){
		var items = this.getPosts(),
			articles = Lowerdash.filter(items.articles, function(article){
				return article.get('featured');
			});

		return listArticles(articles);
	}

	sortBy(field){
		var items = this.getPosts(),
			articles = Lowerdash.sortBy(items.articles, field);

		return listArticles(articles);
	}

	groupBy(field){
		var items = this.getPosts(),
			articles = Lowerdash.groupBy(items.articles, field);

		return listArticles(articles);
	}

	getArticle(url){
		return Lowerdash.find(this.items, function(item){
			return item.get('url') == url;
		});
	}
}
