# Blog setup

A skri.be blog consists in 2 things:

- The [content](data.md) or _data_
- The [theme](themes.md), which contains templates and assets

Create a [package.json](https://docs.npmjs.com/files/package.json) file at the root of your blog, it will describe your blog and specify dependencies.

## Dependencies
Your skri.be blog requires one dependency, the [skri.be package](https://www.npmjs.com/package/skri.be).

Additional dependencies can either be a [theme package](themes.md) or any other JS/CSS library (jQuery, Bootstrap, VelocityJS, etc)

```
"dependencies": {
	"skri.be": "latest",
	"bootstrap": "3.3.6",
	"any-theme-package": "any-theme-package#version/git url",
},
```

## Run your blog!
Skri.be exposes 3 functions to run your blog. The best solution consists in defining custom scripts in the `script` field of your [package.json file](https://docs.npmjs.com/files/package.json#scripts).


### dev()
Consider adding a `dev.js` file at the root of your blog which contains:
```
require('skri.be').dev();
```

### build()
Add a `build.js` file to make a build of the static blog:
```
require('skri.be').build();
```

### purge()
Optionally, you can specify a purge script in order to cleanup your cache.

```
require('skri.be').purge();
```

#### Then your script field look like:
```
"scripts": {
	"purge": "node purge.js",
	"dev": "NODE_ENV=dev node dev.js",
	"build": "NODE_ENV=production node build.js"
},
```

## config

This is where you configure your blog.

### port
Dev server port: `"port": "8080"`

### testPort
After completing a build, you can test the result in a simple web server, on an alternate port: `"port": "8081"`

### theme

Tell skri.be were to find your theme by either specifying `path` or `name`:

- `path`
  Path to blog theme, absolute or relative to blog's root. (ie. `./../path/to/theme_folder`).
- `name`
  If theme is a node package (defined as a dependency), specify a `name` field (ie. `any-theme-package`).

#### theme.title, theme.description
Blog meta

#### theme.tags
An array of featured tags you'll want to display, for example, in a navigation bar.

## Final package file
```
{
	"name": "blog-package-name",
	"version": "0.0.1",
	"homepage": "http://blog-url.tld",
	"description": "Blog package description",
	"dependencies": {
		"skri.be": "0.3.3",
		"bootstrap": "3.3.6",
		"any-theme-package": "0.0.5"
	},
	"scripts": {
		"purge": "node purge.js",
		"dev": "NODE_ENV=dev node dev.js",
		"build": "NODE_ENV=production node build.js"
	},
	"config": {
		"port": 8084,
		"testPort": 8085,
		"theme": {
			"name": "any-theme-package"
		},
		"title": "Greatest blog in the world",
		"description": "Greatest blog in the world because it has the best content in the world!",
		"tags": [
			"dolphin", "cat", "tuning", "gifs"
		]
	}
}

```

## Blog structure

```
blog-root
|_ build
|_ data
|   |_ some-blog-post
|   |   |_ data.md
|   |   |_ image.jpg
|   |   |_ other-image.jpg
|   |
|   |_ some-other-blog-post
|       |_ data.md
|       |_ great-image.jpg
|
|_ package.json
|_ build.js
|_ dev.js
|_ purge.js
|_ node_modules
```