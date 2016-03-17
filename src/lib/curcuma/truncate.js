import { curry } from 'ramda';

function truncate(length, trail = '…', str){
	if(str.length > length){
		str = str.substring(0, length);

		let index = str.lastIndexOf(' ');

		if(index != -1) {
			str = str.substr(0, index);
		}

		str = str + trail;
	}

	return str;
}

var curried = curry(truncate);

export default curried;
