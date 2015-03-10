var Collection = require('./../Base/Collection'),
	LocalMedia = require('./Model.Local'),
	RemoteMedia = require('./Model.Remote'),
	Path = require('path'),
	_ = require('hidash'),
	Class = require('./../Base/Class');

module.exports = Class({
	inherits: Collection,
	
	addItem: function(item){
		var media,
			options = {
				pathToBlog: this.options.pathToBlog
			};
		
		if(/^http/.test(item.url)){
			media = new RemoteMedia(options);
			
		} else {
			item.url = Path.join(item.baseUrl, item.url);
			media = new LocalMedia(options);
		}
				
		delete item.baseUrl;

		return media.merge(item);
	},
	
	addItems: function(items, cb){
		_.eachAsync(items, function(item, i, cursor){
			var media = this.addItem(item);
			this.items.push(media);
			media.getOEmbedInfo()
				.request(cursor);
		}, cb, this);
		
		return this;
	}
});