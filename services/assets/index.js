import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import less from 'less';
import chokidar from 'chokidar';

// import babel from 'babel';
var babel = require('babel');

export default function(Writenode){
    return new Bluebird((resolve, reject) => {
		let articles = Writenode.getService('articles'),
	        views = Writenode.getService('views'),
	        { pathToTheme } = Writenode.getService('conf'),
	        autoprefixPlugin = new LessPluginAutoPrefix({
	    		browsers: ['last 2 versions']
	    	}),
	        readFile = Bluebird.promisify(fs.readFile),
	        transpile = Bluebird.promisify(babel.transformFile),
			transpiled = {},
			lessed = {};

        function renderLessFromFile(path){
			if(lessed[path]){
				console.info('SKIP LESS: ', path);

				return Bluebird.resolve(lessed[path].css);

			} else {
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
	                .then(output => {
						let { css, imports } = output;

						lessed[path] = {
							css
						};

						if(imports.length > 0){
							console.info('LESS IMPORTS: ' + path + ' imports', imports);
						}

						console.info('COMPILE LESS: ', path);

						return output.css;
					});
			}
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

		let watcher = chokidar.watch([
			pathToTheme + '/less',
			pathToTheme + '/css',
			pathToTheme + '/js/**/*.es',
			pathToTheme + '/js/**/*.es6',
			pathToTheme + '/js/**/*.es7',
			pathToTheme + '/js/**/*.jsx',
		])
			.on('change', path => {
				console.info('ASSET CHANGE: ', path);
			})
			.on('ready', () => {
				return resolve({
					process,
				});
			});
    });
}
