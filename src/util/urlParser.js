export function parseUrl(url) {
	var type = 'html',
		cleanPath = url.replace(/\.html$/, '');

	if(/\.json$/.test(url)) {
		type = 'json';
		cleanPath = url.replace(/\.json$/, '');

	} else if(/\/(partial)(\.html)?$/.test(url)) {
		type = 'partial';
		cleanPath = url.replace(/\/(partial)(\.html)?$/, '');

	} else if(/\.([a-z0-9]+)$/i.test(url)) {
		type = 'media';
		cleanPath = url;
	}

	cleanPath = cleanPath.replace(/^\//, '');

	return {
		type,
		cleanPath,
	};
}

const ARTICLE_ID_RE = /(\/data)\/(.*)\//;

// Better, but no lookbehind in JS :(
// const ARTICLE_ID_RE = /(?<=\/data\/)(.*)\/(?=.*(\.[a-z|A-Z|0-9])?)/;

export function getArticleId(path){
	return path.match(ARTICLE_ID_RE)[2];
}
