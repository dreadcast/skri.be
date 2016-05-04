import { assoc } from 'ramda';
import { PROCESS_ASSET } from './AssetActions';

const defaultState = {};

export default function asset(state = defaultState, action) {
	switch (action.type) {
		case PROCESS_ASSET:
			return assoc(action.path, action.asset, state);

		default:
			return state;
	}
}
