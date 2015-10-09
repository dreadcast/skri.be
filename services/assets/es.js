import Bluebird from 'bluebird';
var babel = require('babel');

export default function(Writenode){
	let watcher = Writenode.getService('watcher'),
        { pathToTheme } = Writenode.getService('conf'),
        transpile = Bluebird.promisify(babel.transformFile),
		transpiled = {};

    function process(path){
        return transpile(path, {
            filename: path,
            ast: false,
            comments: false
        })
            .then(transpiled => transpiled.code);
    }

    watcher.addChangeHandler([
        pathToTheme + '/**/*.jsx',
        pathToTheme + '/**/*.es7',
        pathToTheme + '/**/*.es6',
        pathToTheme + '/**/*.es'
    ], path => {
        console.info('Flush compiled ES files');

        lessed = {};
    });

    return Bluebird.resolve({
        process
    });
}
