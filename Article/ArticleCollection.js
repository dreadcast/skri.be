import Lowerdash from 'lowerdash';
import Path from 'path';
import PageableCollection from 'backbone.paginator';
import ArticleModel from './ArticleModel';

function listArticles(articles, properties){
	return Lowerdash.merge({
		articles: articles,
		total: articles.length
	}, properties);
};

export default class ArticleCollection extends PageableCollection {
	model = ArticleModel;
	defaultTemplates = {};
	tags = [];

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

	setTemplatesPath(templates, pathToTheme){
		return Lowerdash.mapValues(templates, template => {
			if(typeof template == 'string'){
				// Path to template file for HTML views
				return Path.join(pathToTheme, template);

			} else {
				// Or array of fields for JSON views
				return template;
			}
		})
	}

	setDefaultTemplates(templates, pathToTheme){
		this.defaultTemplates = Lowerdash(this.defaultTemplates)
			.merge(templates)
			.mapValues(type => this.setTemplatesPath(type, pathToTheme))
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
