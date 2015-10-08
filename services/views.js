import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import nunjucks from 'nunjucks';
import swig from 'swig';
import chokidar from 'chokidar';

export default function(Writenode){
    return new Bluebird((resolve, reject) => {
        let readFile = Bluebird.promisify(fs.readFile),
            precompiledTemplates = {},
            { defaultTemplates, pathToBlog, pathToTheme } = Writenode.getService('conf');


        function precompile(pathToTemplate){
            if(precompiledTemplates[pathToTemplate]){
                // console.info('Skip precompile template: ', pathToTemplate);

                return Bluebird.resolve(precompiledTemplates[pathToTemplate]);

            } else {
                // console.info('Precompile template: ', pathToTemplate);

                switch(Path.extname(pathToTemplate)){
                    case '.nun':
                    case '.nunj':
                    case '.nunjucks':
                        return readFile(pathToTemplate, {
                                encoding: 'utf-8'
                            })
                            .then(data => {
                                let render = nunjucks.compile(data, null, pathToTemplate).render;
                                precompiledTemplates[pathToTemplate] = render;

                                return render;
                            });
                        break;

                    case '.twig':
                    case '.swig':
                        return new Bluebird((resolve, reject) => {
                            var render = swig.compileFile(pathToTemplate, {
                    			filename: pathToTemplate
                    		});
                            precompiledTemplates[pathToTemplate] = render;

                            return resolve(render);
                        });
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

        let watcher = chokidar.watch([
            pathToTheme + '/partial',
            pathToTheme + '/tpl',
        ])
            .on('change', path => {
                // console.info('Flush precompiled templates');

                precompiledTemplates = {}
            })
            .on('ready', () => {
                return resolve({
                    defaultTemplates,
                    render,
                    renderJson,
                    renderJsonList,
                });
            });
    });
}
