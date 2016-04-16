import Bluebird from 'bluebird';
import fs from 'fs-extra';
import Path from 'path';
import SparkMD5 from 'spark-md5';
import { assoc } from 'ramda';
import logger from './../../util/logger';
import parseMarkdown from './../../lib/markdown-parser.js';
import { SumError, CacheError, MarkDownParsingError } from './ArticleError';

const outputFile = Bluebird.promisify(fs.outputFile);
const readFile = Bluebird.promisify(fs.readFile);
const readJson = Bluebird.promisify(fs.readJson);

const pathRe = /data\.md$/;

function readCachedArticle(mdData, sumPath, cachePath) {
	let hash = SparkMD5.hash(mdData);

	return readFile(sumPath, 'utf8')
		.catch(error => {
			throw new SumError({
				hash,
				mdData,
			});
		})
		.then(fileHash => {
			if(fileHash == hash) {
				return readJson(cachePath, 'utf8')
					.then(article => {
						logger.info('READ FROM CACHE', cachePath);

						return assoc('fromCache', true, article);
					})
					.catch(error => {
						throw new CacheError({
							hash,
							mdData,
						});
					})

			} else {
				throw new CacheError({
					hash,
					mdData,
				});
			}
		})
}

function readArticleMdFile(path) {
	return readFile(path, {
		encoding: 'utf8'
	})
		.catch(error => logger.error('Error reading file ' + path, error))
}

export function fetchArticle(path){
	let sumPath = path.replace(pathRe, '.sum'),
		cachePath = path.replace(pathRe, '.jsoncache');

	return readArticleMdFile(path)
		.then(mdData => readCachedArticle(mdData, sumPath, cachePath))
		.catch(SumError, CacheError, error => {
			let { hash, mdData } = error.message;

			if(error instanceof SumError) {
				logger.warn(
					'NO SUM FILE',
					'Write new sum file',
					hash,
				);


			} else if(error instanceof CacheError) {
				logger.warn(
					'NO CACHE FILE',
					cachePath,
					hash,
				);
			}

			return outputFile(sumPath, hash)
				.then(result => parseMarkdown(mdData, path));
		})
}
