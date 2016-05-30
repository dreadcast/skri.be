# Blog setup
33,50
Create a [package.json](https://docs.npmjs.com/files/package.json) file at the root of your blog, this will describe your project and dependencies.

## Required fields
### Dependencies
Your skri.be blog requires one dependency, skri.be itself and, possibly a [skri.be theme](themes.md).

```
"dependencies": {
	"skri.be": "latest",
	"any-theme-package": "any-theme-package#version/git url"
},

```

To run your blog, you'll need to specify a `scripts` [field](https://docs.npmjs.com/files/package.json#scripts) and matching JS files.

### dev
This one provides a local dev server.
`"dev": "NODE_ENV=dev node dev.js"`.
`dev.js` will _at least_ require the skri.be module which exports a `dev()` method.
```
require('skri.be').dev();
```
### build
This script will build your static blog.
```
require('skri.be').build();
```
### purge
Optionally, you can specify a purge script in order to cleanup your cache.

```
require('skri.be').purge();
```

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
Before publishing your build, you can test it on an alternate port: `"port": "8081"`

### theme
#### path

Path to blog theme, relative to blog's root. If theme is
a node package, path will look like `node_modules/THEME_NAME`.

#### title, description
Blog meta

#### tags
An array of featured tags you'll want to display, for example, in a navigation bar.

## Final package file
```
{
	"name": "blog-package-name",
	"version": "0.0.1",
	"homepage": "http://blog-url.tld",
	"description": "Blog package description",

	"main": "./dev.js",

	"scripts": {
		"purge": "node purge.js",
		"dev": "NODE_ENV=dev node dev.js",
		"build": "NODE_ENV=production node build.js"
	},

	"config": {
		"port": 8084,
		"testPort": 8085,
		"theme": {
			"path": "./../../themes/writenode-theme-default"
		},
		"title": "Greatest blog in the world",
		"description": "Greatest blog in the world because it has the best content in the world!",
		"tags": [
			"dolphin", "cat", "tuning", "gifs"
		]
	}
}

```
