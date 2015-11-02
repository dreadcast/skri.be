exports.init = function(config, posts){
	var _ = require('hidash'),
		Path = require('path'),
		here = 'http://converge.dreadcast.com',
		fs = require('fs'),
		Rss = require('rss'),
		feedProperties = {
			title: config.site.title,
			description: config.site.description,
			generator: 'Node RSS',
			feed_url: here + '/feed.rss',
			site_url: here,
			image_url: here + '/asset/img/ico.png',
			author: 'Raphaël Gully',
			language: 'en',
			//categories optional array of strings One or more categories this feed belongs to.
			pubDate: new Date().getTime()
		},
		feed = new Rss(feedProperties);
	
	_(posts).each(function(post, i){
		if(i < config.feedLength){
			var item = {
				title: post.title,
				description: post.content,
				url: here + post.url,
				categories: post.tags,
				date: post.created ? Date.parse(post.created) : new Date().getTime()
			};
			
			if(post.medias){
				var fileUrl = post.url + '/' + post.medias[0].filename;
				
				item.enclosure = {
					url: here + '/' + fileUrl,
					file: Path.join(config.blogRoot, 'data', fileUrl),
				};
			}
				
			feed.item(item);
		}
	});
	
	return feed.xml();
}