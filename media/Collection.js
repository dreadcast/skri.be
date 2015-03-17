(function(){
	var SuperCollection = require('./../Base/Collection'),
		LocalMedia = require('./Model.Local'),
		RemoteMedia = require('./Model.Remote'),
		Path = require('path'),
		_ = require('hidash');
	
	var MediaCollection = SuperCollection.extend({
		model: function(attributes){
			if(/^http/.test(attributes.url)){
				media = new RemoteMedia(attributes);
				
			} else {
				attributes.url = Path.join(attributes.baseUrl, attributes.url);
				media = new LocalMedia(attributes);
			}
			
			return media;
		},
		
		addItems: function(medias, cb){
			_.eachAsync(medias, function(media, i, cursor){
				this.add(media);
				
				media = this.get(media.url);
				media.pathToBlog = this.pathToBlog;
				
				media.getOEmbedInfo()
					.request(cursor);
			}, cb, this);
			
			return this;
		}
	});
	module.exports = MediaCollection;
})();