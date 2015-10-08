import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import nunjucks from 'nunjucks';
import swig from 'swig';

export default function(Writenode){
    return new Bluebird((resolve, reject) => {
        let precompiledTemplates = {},
            { defaultTemplates, pathToBlog, pathToTheme } = Writenode.getService('conf');

        function precompile(template){
            if(precompiledTemplates[template]){
                return Bluebird.resolve(precompiledTemplates[template]);
            }

            switch(Path.extname(template)){
                case '.nun':
                case '.nunj':
                case '.nunjucks':
                    return new Bluebird((resolve, reject) => {
                        fs.readFile(template, {
                            encoding: 'utf-8'
                        }, (error, data) => {
                            if(error){
                                reject(error)

                            } else {
                                let render = nunjucks.compile(data, null, template).render;
                                precompiledTemplates[template] = render;

                                return resolve(render);
                            }
                        })
                    });
                    break;

                case '.twig':
                case '.swig':
                    return new Bluebird((resolve, reject) => {

                        var render = swig.compileFile(template, {
                			filename: template
                		});
                        precompiledTemplates[template] = render;
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

        function renderJson(data, template){
            return Lowerdash.pick(data, template.json);
        }

        function renderJsonList(data, template){
            return Lowerdash.map(data, item => Lowerdash.pick(item, template));
        }

        function render(template, data){
            return precompile(template).then(render => render(data));
        }

        return resolve({
            defaultTemplates,
            render,
            renderJson,
            renderJsonList,
        });
    });
}
