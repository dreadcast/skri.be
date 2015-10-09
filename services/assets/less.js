import fs from 'fs-extra';
import Bluebird from 'bluebird';
import LessPluginAutoPrefix from 'less-plugin-autoprefix';
import less from 'less';

export default function(Writenode){
	let watcher = Writenode.getService('watcher'),
        { pathToTheme } = Writenode.getService('conf'),
        autoprefixPlugin = new LessPluginAutoPrefix({
    		browsers: ['last 2 versions']
    	}),
        readFile = Bluebird.promisify(fs.readFile),
        lessed = {};

    function process(path){
        if(lessed[path]){
            // console.info('SKIP LESS: ', path);

            return Bluebird.resolve(lessed[path]);

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
        			lessed[path] = output.css;

        			// console.info('COMPILE LESS: ', path);

        			return output.css;
        		});
        }
    }

    watcher.addChangeHandler([
        pathToTheme + '/css/**/*',
        pathToTheme + '/less/**/*'
    ], path => {
        console.info('Flush compiled less');

        lessed = {};
    });

    return Bluebird.resolve({
        process
    });
}
