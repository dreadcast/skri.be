/**
 * Find value closest to given number in an array of numbers
 * @method closest
 * @param {Number} value	Value to look closest for
 * @param {Array} list		List to get closest from
 * @return {Number}			Closest value
 */
export default function closest(value, list){
	return list.reduce(function(previous, current) {
		var isInferior = Math.abs(current - value) < Math.abs(previous - value);

		return isInferior ? current : previous;
	});
}
