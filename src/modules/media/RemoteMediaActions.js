import logger from './../../util/logger';
import { merge, assoc } from 'ramda';
import { getOEmbedData } from './RemoteMediaClient';
import { UPDATE_MEDIA, getRatio } from './MediaActions';

export function getOEmbedInfo(media, articleId){
	return function(dispatch, getState){
		return getOEmbedData(media.url)
			.then(oEmbed => {
				oEmbed = assoc('caption', oEmbed.title, oEmbed);
				oEmbed = merge(oEmbed, media);

				if(oEmbed.type == 'photo'){
					oEmbed = assoc('html', `<img src="${oEmbed.url}" alt="${oEmbed.caption}">`, oEmbed);
				}

				media = merge(oEmbed, getRatio(oEmbed.width, oEmbed.height));

				dispatch({
					type: UPDATE_MEDIA,
					mediaId: oEmbed.id,
					media,
					articleId,
				});

				return media;
			});
	}
}
