import swig from 'swig';

export default function precompile(pathToTemplate){
    var render = swig.compileFile(pathToTemplate, {
        filename: pathToTemplate
    });

    return Promise.resolve(render);
}
