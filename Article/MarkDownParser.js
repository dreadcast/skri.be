(function(){
	var fs = require('fs'),
		_ = require('hidash'),
		Path = require('path'),
		s = require('superscore.string'),
	// 	superString = require('./../string-utils'),
		markdown = require('markdown').markdown,
		Class = require('./../Base/Class');
		
	var MarkDownParser = Class({
		constructor: function(path){
			this.path = path;
		},
		
		parseData: function(data, cb){
			var parts = data.replace(/(\r\n|\r)/g, '\n').split(/\n{3,}/),
				metalines = parts[0].split(/(\n+)/),
				content = parts[1];			
			
			this.parseMetas(metalines, function(){
				if(fs.existsSync(Path.join(this.path, 'cover.jpg')))
					this.data.cover = '/' + this.url + '/cover.jpg';
				
				if(this.data.medias && this.data.medias.length > 0)
					this.data.defaultImage = this.data.medias[0].url;
					
				else if(this.data.cover)
					this.data.defaultImage = 'cover.jpg';
				
				var title = parts[1].match(/#(.*)\n/);
				this.data.title = title[1];			
				
				content = markdown.toHTML(content.replace(title[0], ''));
	// 			this.data.content = this.substitute(content);
				this.data.content = content;
				//this.data.summary = this.data.content.stripTags().truncate(300, '…', ' ').toString();
				
				cb(this.data);
			}.bind(this));
			
			return this;
		},
		
		substitute: function(content){
			return content.replace(/\$\(([a-z|0-9|\.]+)\)/gi, function(a, b){
				return _.getFromPath(this.data, b);
			}).replace(/\$media\(([0-9]+)\)/gi, function(a, b){
				var media = this.data.medias[b];
				
				return media.html;
			}.bind(this)).replace(/\$media\(([a-z|0-9|-|_|\.]+)\)/gi, function(a, b){
				var filteredMedias = _.filter(this.data.medias, function(media){
					return media.filename == b;
				});
				
				if(filteredMedias.length != 1){
					console.log('Error parsing media : \n\n' + a);
					return a;
				}
				
				var media = filteredMedias[0];
				
				return '<img alt="' + media.title + '" title="' + media.title + '" src="' + media.url + '">';
			}.bind(this));
		},
		
		parseMetas: function(metalines, cb){
			var medias = [];
			this.data = {
				url: this.url
			};
	
			_.each(metalines, function(line){
				var meta = line.match(/([a-z|A-Z|0-9|\-|\_]+):(\s*)(.*)/);
				
				if(meta){
					var tag = meta[1],
						value = meta[3];
					
					if(tag == 'tags')
						value = _.map(value.split(/,\s?/), function(tag){
							return s.slugify(tag).replace(/[^a-zA-Z]/g, '');
						});
	
					if(/media/.test(tag))
						medias.push(value);
						
					else
						_.setFromPath(this.data, tag, value || true);

				}
			}.bind(this));
			
			if(medias.length > 0)
				this.parseMedias(medias);
			
			cb.call(this)
			
			return this;
		},
		
		parseMedias: function(medias){
			this.data.medias = [];
			
			_.each(medias, function(media, i){
				var mediaParts = media.split(/([\t]+)/);
				
				this.data.medias.push({
					baseUrl: this.url,
					url: mediaParts[0],
					title: mediaParts[2]
				});
			}, this);
		},
		
		parseFile: function(cb){
			fs.readFile(this.path, {
				encoding: 'utf8'
			}, function(err, fileContent){
				this.parseData(fileContent, cb);
			}.bind(this));
			
			this.path = this.path.replace(Path.sep + 'data.md', '');
			this.url = Path.basename(this.path);
		}
	});
	
	module.exports = MarkDownParser;
})();