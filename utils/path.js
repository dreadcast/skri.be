var Path = require('path'),
	_ = require('hidash');

Path.prepend = function(path, prepend){
	var re = new RegExp('^' + prepend);
	
	return prepend + path.replace(re, '');
};

module.exports = Path;