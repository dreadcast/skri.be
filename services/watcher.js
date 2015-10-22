import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import chokidar from 'chokidar';
import anymatch from 'anymatch';

export default function(Writenode){
    return new Bluebird((resolve, reject) => {
        let changeHandlers = new Map,
            { pathToBlog, pathToTheme } = Writenode.getService('conf');

        function addChangeHandler(matcher, handler){
            changeHandlers.set(matcher, handler);
        }

        let watcher = chokidar.watch([
            pathToTheme,
            pathToBlog + '/data/**/data.md',
        ], {
			ignored: '.git/**'
		})
            .on('change', path => {
                // console.info('WATCHER CHANGE: ', path);

                changeHandlers.forEach((changeHandler, matcher) => {
                    if(anymatch(matcher, path)){
                        changeHandler(path);
                    };
                });

            })
            .on('ready', () => {
                return resolve({
                    addChangeHandler,
                    watcher
                });
            });
    });
}
