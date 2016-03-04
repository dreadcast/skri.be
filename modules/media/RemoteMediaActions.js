import Request from 'request-promise';

import { UPDATE_MEDIA } from './MediaActions.js';

function getOEmbedParams(url){
	return function(dispatch, getState){
		let oEmbedUrl,
			provider;

		if(/(bandcamp\.com)/.test(url)){
			provider = 'bandcamp';
			oEmbedUrl = `http://api.embed.ly/1/oembed?url=${url}`;

		} else if(/(youtube\.com|youtube\.be)/.test(url)){
			provider = 'youtube';
			oEmbedUrl = `http://www.youtube.com/oembed?url=${url}&format=json`;

		} else if(/soundcloud\.com/.test(url)){
			provider = 'soundcloud';
			oEmbedUrl = `http://www.soundcloud.com/oembed?url=${url}&format=json`;

		} else if(/(instagram\.com|instagr\.am)/.test(url)){
			provider = 'instagram';
			oEmbedUrl = `http://api.instagram.com/oembed?url=${url}`;

		} else if(/(flickr\.com)/.test(url)){
			provider = 'flickr';
			oEmbedUrl = `http://flickr.com/services/oembed?format=json&url=${url}`;

		} else if(/(vimeo\.com)/.test(url)){
			provider = 'vimeo';
			oEmbedUrl = `http://vimeo.com/api/oembed.json?url=${url}`;

		} else if(/(deviantart\.com)/.test(url)){
			provider = 'deviantart';
			oEmbedUrl = `http://backend.deviantart.com/oembed?format=json&url=${url}`;

		} else if(/(slideshare\.net)/.test(url)){
			provider = 'slideshare';
			oEmbedUrl = `http://www.slideshare.net/api/oembed/2?url=${url}&format=json`;

		} else if(/(mixcloud\.com)/.test(url)){
			provider = 'mixcloud';
			oEmbedUrl = `http://www.mixcloud.com/oembed/?url=${url}&format=json`;

		} else if(/(dailymotion\.com)/.test(url)){
			provider = 'dailymotion';
			oEmbedUrl = `http://www.dailymotion.com/services/oembed?format=json&url=${url}`;

		} else if(/(kickstarter\.com)/.test(url)){
			provider = 'kickstarter';
			oEmbedUrl = `http://www.kickstarter.com/services/oembed?url=${url}`;

		} else if(/(sketchfab\.com)/.test(url)){
			provider = 'sketchfab';
			oEmbedUrl = `https://sketchfab.com/oembed?url=${url}`;

		}

		return dispatch({
			type: UPDATE_MEDIA,
			id: url,
			media: {
				provider,
				oEmbedUrl,
			}
		});
	}
}

export function getOEmbedInfo(url){
	return function(dispatch, getState){
		let { oEmbedUrl, provider } = dispatch(getOEmbedParams(url));

		return Request({
			method: 'GET',
			json: true,
			uri: oEmbedUrl
		})
			.then(oEmbed => {
				dispatch({
					type: UPDATE_MEDIA,
					id: url,
					media: oEmbed,
				});

				if(oEmbed.type == 'photo'){
					let html = `<img src="${oEmbed.url}" alt="${oEmbed.title}">`;

					dispatch({
						type: UPDATE_MEDIA,
						id: url,
						media: {
							html,
						},
					});
				}
			})
			.catch(error => console.info(error));
	}
}
