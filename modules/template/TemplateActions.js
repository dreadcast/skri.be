import Bluebird from 'bluebird';
import { precompile } from './engine/Nunjucks.js';

export const SET_DEFAULT_TEMPLATES = 'SET_DEFAULT_TEMPLATES';
export const PRECOMPILE_TEMPLATE = 'PRECOMPILE_TEMPLATE';
// export const COMPILE_TEMPLATE = 'COMPILE_TEMPLATE';

export function getTemplate(path) {
	return function(dispatch, getState) {
		if(getState().templates[path]){
			return Bluebird.resolve(getState().templates[path]);
		}

		return dispatch(precompileTemplate(path))
			.then(({ render }) => render);
	}
}

// export function compileTemplate(template, data) {
// 	return function(dispatch, getState) {
// 		dispatch({
// 			type: COMPILE_TEMPLATE,
// 			template,
// 			data,
// 		});
// 	}
// }

export function precompileTemplate(path) {
	return function(dispatch, getState) {
		return precompile(path)
			.then(render => {
				return dispatch({
					type: PRECOMPILE_TEMPLATE,
					path,
					render,
				});
			});
	}
}
