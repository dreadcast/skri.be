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
        { pathToBlog, defaultTemplates, pathToTheme } = Writenode.getService('conf');

    articles.setDefaultTemplates(defaultTemplates, pathToTheme);

    function parseMarkdown(rawMarkdown, filePath){
        let { attributes, body } = FrontMatter(rawMarkdown),
            articleId = filePath.replace('data/', '').replace('/data.md', '');

        if(typeof attributes.tags == 'string'){
            attributes.tags = attributes.tags.split(/,\s?/);
        }

        attributes.id = articleId;
        var parsedContent = body.match(/#(.*)\n/);

        if(parsedContent){
            attributes.title = parsedContent[1];
            attributes.content = marked(parsedContent.input.replace(parsedContent[0], ''));

        } else {
            attributes.content = body;
        }

        let defaultTemplates = articles.getDefaultTemplates('article');

        if(attributes.templates){
            let articleTemplates = articles.setTemplatesPath(attributes.templates, pathToBlog);

            Lowerdash.assign(attributes.templates, defaultTemplates, articleTemplates);
        } else {
            attributes.templates = defaultTemplates;
        }

        let article = new ArticleModel({
            id: articleId,
            url: articleId
        }, {
            pathToBlog
        });

        article.on('change:tags', article => {
            articles.addTags(article.get('tags'));
        });

        articles.add(article);
        article.set(attributes);

        return article.getMedias();
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
                .then(() => resolve(articles));
        });
        watcher.on('add', filePath => queue.push(filePath));
        watcher.on('change', handleFileChange);

        return watcher;
    });
}
