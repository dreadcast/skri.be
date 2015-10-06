import Path from 'path';
import fs from 'fs-extra';
import recurse from 'fs-recurse';
import express from 'express';
import Bluebird from 'bluebird';

export default function(Writenode){
	var server = express();

    return new Bluebird((resolve, reject) => {
        server.listen(Writenode.getService('conf').port);

        return resolve(server);
    });
}
