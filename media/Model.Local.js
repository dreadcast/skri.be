;(function(){
	var //Prime = require('prime'),
		_ = require('hidash'),
		Class = require('./../Base/Class'),
		Path = require('path'),
		imageinfo = require('imageinfo'),
		fs = require('fs'),
		MediaModel = require('./Model'),
		schema = {
			'filename': {
				require: ['url'],
				compute: function(){
					return Path.basename(this.get('url'));
				}
			},
			'html': {
				require: ['url', 'title'],
				compute: function(){
					return '<img src="' + this.get('url') + this.get('title') + '">';
				}
			}
		};
	
	var LocalMediaModel = Class({
		inherits: MediaModel,
		
		setSchema: function(){
			this.parent();
			this.schema = this.mergeSchema(schema);
			
			return this;
		},
		
		getOEmbedInfo: function(){
			return this.set('provider', 'local')
				.set('type', 'image');
		},
		
		request: function(cb){
			var path = Path.join(this.options.pathToBlog, 'data', this.get('url'));
			
			fs.readFile(path, function(err, data){
				if(err)
					console.error('Error reading file ' + path, err);
					
				try{
					var info = imageinfo(data);
					
					this.merge({
						width: info.width,
						height: info.height
					});
				} catch(e){
					console.error('Image info error', e);
				}
				
				cb();
			}.bind(this));
			
			return this;
		}
	});
	
	module.exports = LocalMediaModel;
})();