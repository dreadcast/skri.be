;(function(){
	var _ = require('hidash'),
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
	
	var LocalMediaModel = MediaModel.extend({
		getOEmbedInfo: function(){
			return this.set('provider', 'local')
				.set('type', 'image');
		},
		
		setSchema: function(){
			this.schema = _.merge({}, this.schema, schema);
			
			return this;
		},
		
		request: function(cb){
			var path = Path.join(this.pathToBlog, 'data', this.get('url'));
			
			fs.readFile(path, function(err, data){
				if(err)
					console.error('Error reading file ' + path, err);
					
				try{
					var info = imageinfo(data);
					
					this.set({
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