import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import less from 'less';

// import babel from 'babel';
var babel = require('babel');

export default function(Writenode){
	let articles = Writenode.getService('articles'),
        views = Writenode.getService('views'),
        { pathToTheme } = Writenode.getService('conf'),
        autoprefixPlugin = new LessPluginAutoPrefix({
    		browsers: ['last 2 versions']
    	}),
        readFile = Bluebird.promisify(fs.readFile),
        transpile = Bluebird.promisify(babel.transformFile);

        function renderLessFromFile(path){
            return readFile(path, {
                    encoding: 'utf-8'
                })
                .then(data => {
                    return less.render(data, {
                        plugins: [autoprefixPlugin],
                        paths: [
                            pathToTheme + '/less',
                            pathToTheme + '/bower_components/bootstrap/less',
                        ],
                        filename: path,
                        // compress: config.mode != 'dev'          // Minify CSS output
                    })
                })
                .then(output => output.css);
        }

        function process(path){
            switch(Path.extname(path)){
                case '.es':
                case '.es6':
                case '.es7':
                case '.jsx':
                    return transpile(path, {
                            filename: path,
                            ast: false,
                            comments: false
                        })
                        .then(transpiled => transpiled.code);
                    break;

                case '.css':
                case '.less':
                    return renderLessFromFile(path);
                    break;

                default:
                    return readFile(path, {
                        encoding: 'utf-8'
                    });
                    break;
            }
        }


    return Promise.resolve({
        process
    });
}
