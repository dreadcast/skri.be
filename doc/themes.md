# Themes

A skri.be theme contains all templates and assets you'll need to generate a
static blog. [Nunjucks](https://github.com/mozilla/nunjucks) is currently the
only supported template engine.

Just like your blog, your theme should be a valid npm package and thus,
contain a valid `package.json`.

## Fields

There are two fields, `main` whose value will always be `package.json` and a
config.

### Theme config

The `config.defaultTemplates` field specify which template file is used for.

#### articleCollection
An article collection is a list of articles for a given tag.
The `html` field is a path to the template that displays collections.
The `json` field specify which article properties should be displayed when using
XHR to load your data.

#### article
An article is usually a folder containg a `data.md` file and some medias.
The `html` field is a path to the layout template that displays articles.
The `partial` field is a path to the partial template.
The `json` field specify which article properties should be displayed when using
XHR to load your data.

```
"config": {
	"defaultTemplates": {
		"articleCollection": {
			"html": "asset/tpl/articles.nunjucks",
			"json": [
				"title",
				"url",
				"id",
				"created",
				"tags",
				"summary"
			]
		},
		"article": {
			"partial": "asset/tpl/partial/article.nunjucks",
			"html": "asset/tpl/article.nunjucks",
			"json": [
				"title", "id", "content",
				"medias", "created", "status",
				"tags", "summary", "url"
			]
		}
	}
}
```
