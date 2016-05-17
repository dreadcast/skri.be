export const ADD_WORDS = 'ADD_WORDS';

export function addWords(articleId, words){
	return function(dispatch, getState){
		return dispatch({
			type: ADD_WORDS,
			articleId,
			words,
		})
	}
}
