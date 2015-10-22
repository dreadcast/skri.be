module.exports = {
	// Paths to tempplates are relatives
	templates: {
		posts: {
			html: 'tpl/posts.twig',
			json: ['title', 'url']
		},
		article: {
			ajax: 'partial/article.twig',
			html: 'tpl/article.twig',
			json: ['title', 'url']
		}
	},

	// theme + blog config
	enableJson: true,
	perPage: 20,
	feedLength: 50
};
