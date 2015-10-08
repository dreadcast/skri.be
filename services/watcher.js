import Path from 'path';
import fs from 'fs-extra';
import Bluebird from 'bluebird';
import Lowerdash from 'lowerdash';
import chokidar from 'chokidar';
import { anymatch } from 'seperscore.string';

export default function(Writenode){
    return new Bluebird((resolve, reject) => {
        let changeHandlers = {},
            { pathToBlog, pathToTheme } = Writenode.getService('conf');

        function onChangeHandler(matcher, handler){
            types.forEach(type => changeHandlers[matcher] = handler);
        }

        let watcher = chokidar.watch([
            pathToTheme,
            pathToBlog + '/data/**/data.md',
        ])
            .on('change', path => {
                var type = Path.extname(path).replace('.', '');

                console.info('WATCHER CHANGE: ', path);

                Lowerdash.each(changeHandlers, (changeHandler, matcher) => {
                    if(anymatch(matcher, path)){
                        changeHandler(path);
                    };
                });

            })
            .on('ready', () => {
                return resolve({
                    onChangeHandler,
                    watcher
                });
            });
    });
}
