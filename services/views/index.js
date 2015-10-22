import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import nunjucks from './nunjucks';
import twig from './twig';

export default function(Writenode){
    let readFile = Bluebird.promisify(fs.readFile),
        precompiledTemplates = {},
        watcher = Writenode.getService('watcher'),
        { defaultTemplates, pathToBlog, pathToTheme } = Writenode.getService('conf');

    function precompile(pathToTemplate){
        if(precompiledTemplates[pathToTemplate]){
            // console.info('Skip precompile template: ', pathToTemplate);

            return Bluebird.resolve(precompiledTemplates[pathToTemplate]);

        } else {
            // console.info('Precompile template: ', pathToTemplate);

            let render;

            switch(Path.extname(pathToTemplate)){
                case '.nun':
                case '.nunj':
                case '.nunjucks':
                    render = nunjucks(pathToTemplate);
                    break;

                case '.twig':
                case '.swig':
                    render = twig(pathToTemplate);
                    break;

                case '.jade':
                    return jade;
                    break;

                case '.haml':
                case '.hml':
                    return haml;
                    break;

                case '.ejs':
                    return ejs;
                    break;

                case '.hbs':
                    return hbs;
                    break;

                case '.mustache':
                    return mustache;
                    break;
            }

            return render.then(rendered => precompiledTemplates[pathToTemplate] = rendered);
        }
    }

    function renderJson(data, template){
        return Lowerdash.pick(data, template.json);
    }

    function renderJsonList(data, template){
        return Lowerdash.map(data, item => Lowerdash.pick(item, template));
    }

    function render(template, data){
        return precompile(template).then(render => render(data));
    }

    function flush(){
        // console.info('Flush precompiled templates');

        precompiledTemplates = {}
    }

    watcher.addChangeHandler([
        pathToTheme + '/partial/**/*',
        pathToTheme + '/tpl/**/*',
    ], flush);

    return Bluebird.resolve({
        defaultTemplates,
        render,
        renderJson,
        renderJsonList,
    });
}
