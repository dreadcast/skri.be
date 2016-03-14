export const ADD_TAGS = 'ADD_TAGS';
export const GET_ARTICLES = 'GET_ARTICLES';

export function addTags(tags){
	return function(dispatch, getState){
		return dispatch({
			type: ADD_TAGS,
			tags,
		})
	}
}
