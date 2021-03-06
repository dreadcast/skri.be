import articles from './article/ArticlesReducer.js';
import template from './template/TemplateReducer.js';
import tag from './tag/TagReducer.js';

import { combineReducers } from 'redux';

export default combineReducers({
	articles,
	template,
	tag,
});
