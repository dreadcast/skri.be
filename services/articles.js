import ArticleCollection from './../Article/ArticleCollection';
import ArticleModel from './../Article/ArticleModel';
import Path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import marked from 'marked';
import Bluebird from 'bluebird';
import FrontMatter from 'front-matter';
import Lowerdash from 'lowerdash';

export default function(Writenode){
    let articles = new ArticleCollection,
        readFile = Bluebird.promisify(fs.readFile),
        readdir = Bluebird.promisify(fs.readdir),
        { timestamp, getService } = Writenode,
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

		attributes = setArticleTemplates(attributes);

		let article = setArticleAttributes(attributes);

		return lookupArticleMedias(attributes)
			.then(attributes => {
		        articles.add(article);
		        article.set(attributes);

				return article;
			})
			.then(article => article.getMedias());
    }

	function setArticleAttributes(attributes){
		let article = new ArticleModel({
            id: attributes.id,
            url: attributes.id
        }, {
            pathToBlog
        });

        article.on('change:tags', article => {
            articles.addTags(article.get('tags'));
        });

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

		return attributes;
    }

	function lookupArticleMedias(attributes){
		return readdir(Path.join(pathToBlog, 'data', attributes.id))
			.then(files => {
				if(!attributes.medias){
					attributes.medias = {};
				}

				Lowerdash.chain(files)
					.filter(file => !Lowerdash.contains(['data.md'], file))
					.filter(file => !Lowerdash.some(attributes.medias, media => media.url != file))
					.each(file => {
						attributes.medias[file] = {
							url: file
						}
					})
					.value();

				return attributes;
			});
	}

    function cache(){

    }

    return new Bluebird((resolve, reject) => {
        let watcher = chokidar.watch(pathToBlog + '/data/**/data.md'),
            queue = [];

        function handleFileChange(filePath){
            return readFile(filePath, {
                    encoding: 'utf-8'
                })
                .catch(error => console.error(error))
                .then(rawMarkdown => parseMarkdown(rawMarkdown, Path.relative(pathToBlog, filePath)));
        }


        watcher.on('ready', () => {
            return Bluebird.each(queue, handleFileChange)
                .then(() => {
                    timestamp('Done articles');

                    return resolve(articles);
                });
        });
        watcher.on('add', filePath => queue.push(filePath));
        watcher.on('change', handleFileChange);

        return watcher;
    });
}
