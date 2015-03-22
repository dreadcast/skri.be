var s = require('underscore.string');

s.truncate = function(str, max, trail, atChar){
	if(trail == null && arguments.length == 1)
		trail = '…';
	
	if(str.length > max){
		str = str.substring(0, max);
		
		if(atChar){
			var index = str.lastIndexOf(atChar);
			if(index != -1)
				str = str.substr(0, index);
		}
		
		if(trail)
			str += trail;
	}
	
	return str;
};

s.random = function(length){
    var text = '',
		possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-_abcdefghijklmnopqrstuvwxyz0123456789',
		l = length || 8;

    for(var i = 0; i < l; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = s;