import { curry, pipe } from 'ramda';
import stripTags from './stripTags';
import truncate from './truncate';
import clean from './clean';

function summarize(str){
	return pipe(
		clean(),
		stripTags(),
		truncate(300, undefined),
	)(str);
}

export default curry(summarize);
