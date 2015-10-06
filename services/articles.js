import ArticleCollection from './../Article/ArticleCollection';
import ArticleModel from './../Article/ArticleModel';
import Path from 'path';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import marked from 'marked';
import Bluebird from 'bluebird';
import FrontMatter from 'front-matter';

export default function(Writenode){
    let articles = new ArticleCollection,
        { pathToBlog, templates } = Writenode.getService('conf');

    articles.setTemplates(templates);

    function readFile(filePath){
        return new Bluebird((resolve, reject) => {
            return fs.readFile(filePath, {
                encoding: 'utf-8'
            }, (error, data) => {
                if(error){
                    return reject(error);

                } else {
                    return resolve(data);
                }
            });
        })
    }

    function parseMarkdown(rawMarkdown, filePath){
        let { attributes, body } = FrontMatter(rawMarkdown);

        if(typeof attributes.tags == 'string'){
            attributes.tags = attributes.tags.split(/,\s?/);
        }

        attributes.id = filePath;
        var parsedContent = body.match(/#(.*)\n/);

        if(parsedContent){
            attributes.title = parsedContent[1];
            attributes.content = marked(parsedContent.input.replace(parsedContent[0], ''));

        } else {
            attributes.content = body;
        }

        var article = new ArticleModel({
            id: filePath
        }, {
            pathToBlog
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
            return readFile(filePath)
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
