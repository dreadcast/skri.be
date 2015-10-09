import nunjucks from 'nunjucks';
import fs from 'fs';
import Bluebird from 'bluebird';

export default function precompile(pathToTemplate){
    let readFile = Bluebird.promisify(fs.readFile);

    return readFile(pathToTemplate, {
            encoding: 'utf-8'
        })
        .then(data => nunjucks.compile(data, null, pathToTemplate).render);
}
