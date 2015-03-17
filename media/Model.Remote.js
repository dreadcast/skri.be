;(function(){
	var _ = require('hidash'),
		MediaModel = require('./Model'),
		request = require('request'),
		schema = {
			'html': {},
			'embedUrl': {}
		};

	var RemoteMediaModel = MediaModel.extend({
		setSchema: function(){
			this.schema = _.merge({}, this.schema, schema);
			
			return this;
		},

		request: function(cb){
			request({
				method: 'GET',
				uri: this.get('embedUrl')
			}, function(error, response, oEmbed) {
				if(!error){
					var data = JSON.parse(oEmbed);
					
					if(data.type == 'photo')
						data.html = '<img src="' + data.url + '" alt="' + data.title + '">';
					
					this.set(data);
				} else {
					console.info(error);
				}
				cb();
			}.bind(this));
			
			return this;
		},
		
		getOEmbedInfo: function(){
			var url = this.get('url'),
				oEmbedUrl,
				provider;
			
			if(/(bandcamp\.com)/.test(url)){
				provider = 'bandcamp';
				oEmbedUrl = 'http://api.embed.ly/1/oembed?url=' + url;
			
			} else if(/(youtube\.com|youtube\.be)/.test(url)){
				provider = 'youtube';
				oEmbedUrl = 'http://www.youtube.com/oembed?url=' + url + '&format=json';
			
			} else if(/soundcloud\.com/.test(url)){
				provider = 'soundcloud';
				oEmbedUrl = 'http://www.soundcloud.com/oembed?url=' + url + '&format=json';
			
			} else if(/(instagram\.com|instagr\.am)/.test(url)){
				provider = 'instagram';
				oEmbedUrl = 'http://api.instagram.com/oembed?url=' + url;
	
			} else if(/(flickr\.com)/.test(url)){
				provider = 'flickr';
				oEmbedUrl = 'http://flickr.com/services/oembed?format=json&url=' + url;
	
			} else if(/(vimeo\.com)/.test(url)){
				provider = 'vimeo';
				oEmbedUrl = 'http://vimeo.com/api/oembed.json?url=' + url;
	
			} else if(/(deviantart\.com)/.test(url)){
				provider = 'deviantart';
				oEmbedUrl = 'http://backend.deviantart.com/oembed?format=json&url=' + url;
	
			} else if(/(slideshare\.net)/.test(url)){
				provider = 'slideshare';
				oEmbedUrl = 'http://www.slideshare.net/api/oembed/2?url=' + url + '&format=json';
	
			} else if(/(mixcloud\.com)/.test(url)){
				provider = 'mixcloud';
				oEmbedUrl = 'http://www.mixcloud.com/oembed/?url=' + url + '&format=json';
	
			} else if(/(dailymotion\.com)/.test(url)){
				provider = 'dailymotion';
				oEmbedUrl = 'http://www.dailymotion.com/services/oembed?format=json&url=' + url;
	
			} else if(/(kickstarter\.com)/.test(url)){
				provider = 'kickstarter';
				oEmbedUrl = 'http://www.kickstarter.com/services/oembed?url=' + url;
	
			} else if(/(sketchfab\.com)/.test(url)){
				provider = 'sketchfab';
				oEmbedUrl = 'https://sketchfab.com/oembed?url=' + url;
	
			}
			
			return this.set('provider', provider)
				.set('embedUrl', oEmbedUrl);		
		}
	});
	
	module.exports = RemoteMediaModel;
})();