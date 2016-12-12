#React Pack CLI

## Features

* React full packs
* ES7 support
* Hot reload
* Testing support
* IE8+ support (use React v0.14.8)
* Free combination modules (ie8/redux/router/cssMoudules)


## Files struct
```
|-- dev
|   |-- template
|   |   |-- index.pug				The pug template of the index.html.
|   |-- bage.js						Create coverage bage svg file.
|   |-- dev.config.js				Webpack config file.
|   |-- server.dist.js				Distribution server file.
|   `-- webpack.config.js
|-- src								React source code files.
|-- static							Static files.
|   `-- polyfill.min.js				Babel js polyfill.
|-- app.config.js					App config file.
|-- package.json					NPM package file.
`-- postcss.config.js				Postcss config file.

```

The document of [webpack.config.js](app.config.md).


## Installation

Install react-pack-cli using [npm](https://www.npmjs.com/) (assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g react-pack-cli
```

## Usage

```
react -h   # show react-pack-cli help 
```
help info:
```
Usage: re|react [path] [options]

Options:
  -e, --ie8      Support IE8+ browser
  -x, --redux    Use redux
  -o, --router   Use react-router
  -c, --cssm     Use react css moudules
  -n, --name     Project name
  -t, --testing  Is need testing
  -y             Force to confirm
  -i, --install  Install all dependencies
  -v             Show verbose log
```

The `react` command have a alias `re`.

### Example

```
re myapp -exci 
```
1. Create a react app under **myapp** directory.
2. It have to support `ie8` and use `redux` , `css moudules` libraries. 
3. When it done, install all dependencies with `yarn install` command and follow with a `npm start` command. 

## Packages include

* base
	* webpack
	* babel

* react
	* react
	* react-router
	* react-hot-loader
	* react-css-modules
	* redux
	* react-redux
	* react-redux-router

* css
	* sass
	* postcss
	* autoprefixer

* lint
	* eslint
    * stylelint

* testing
	* karma
	* mocha
	* chai