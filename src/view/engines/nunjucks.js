import nunjucks from 'nunjucks';
import nunjucksDate from 'nunjucks-date';
import CONF from './../../conf';

var nunjucksEnv = nunjucks.configure(CONF.pathToTheme, {
	noCache: true,
	watch: true,
});

nunjucksEnv.addFilter('date', nunjucksDate);

export default nunjucksEnv;
