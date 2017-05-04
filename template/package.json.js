/**
 * Created by dz on 16/11/1.
 */

const defaultPackage = ({ name, userName = '', email = '' }) => (
  {
    "name": name,
    "version": "0.0.0",
    "description": "",
    "homepage": "",
    "author": {
      "name": userName,
      "email": email,
      "url": ""
    },
    "main": "index.js",
    "scripts": {
      "precommit": "npm run precheck",
      "precheck": "npm run eslint && npm run csslint",
      "eslint": "cross-env NODE_ENV=test eslint --cache --ext .jsx,.js src/",
      "csslint": "stylelint src/**/*.scss --syntax scss",
      "start": "node ./dev/server.dev.js",
      "dstart": "cross-env NODE_ENV=production node ./dev/server.dist.js",
      "dist": "rimraf dist/ && cross-env NODE_ENV=production webpack --config ./dev/webpack.dist.js && npm run dstart"
    },
    "dependencies": {
      "prop-types": "^15.5.8",
      "react": "^15.5.4",
      "react-dom": "^15.5.4",
      "react-hot-loader": "^3.0.0-beta.6",
    },
    "devDependencies": {
      "autoprefixer": "^6.7.7",
      "babel-core": "^6.24.1",
      "babel-eslint": "^7.2.3",
      "babel-loader": "^7.0.0",
      "babel-plugin-transform-decorators-legacy": "^1.3.4",
      "babel-preset-es2015": "^6.24.1",
      "babel-preset-react": "^6.24.1",
      "babel-preset-stage-1": "^6.24.1",
      "chalk": "^1.1.3",
      "copy-webpack-plugin": "^4.0.1",
      "cross-env": "^4.0.0",
      "css-loader": "^0.28.0",
      "eslint": "^3.19.0",
      "eslint-config-airbnb": "^14.1.0",
      "eslint-plugin-import": "^2.2.0",
      "eslint-plugin-jsx-a11y": "^4.0.0",
      "eslint-plugin-react": "^6.10.3",
      "extract-text-webpack-plugin": "^2.1.0",
      "file-loader": "^0.11.1",
      "html-asset-webpack-plugin": "^1.0.1",
      "html-webpack-plugin": "^2.28.0",
      "ip": "^1.1.5",
      "node-sass": "^4.5.2",
      "postcss-loader": "^1.3.3",
      "precss": "^1.4.0",
      "pushstate-server": "^3.0.0",
      "react-dev-utils": "^0.5.2",
      "rimraf": "^2.6.1",
      "sass-loader": "^6.0.3",
      "style-loader": "^0.17.0",
      "stylelint": "^7.10.1",
      "stylelint-config-standard": "^16.0.0",
      "url-loader": "^0.5.8",
      "webpack": "^2.4.1",
      "webpack-dev-server": "^2.4.5",
      "stylelint-declaration-use-variable": "^1.6.0",
      "stylelint-scss": "^1.4.4",
    },
    "repository": "",
    "license": "MIT"
  }
);

const testPackage = {
  "scripts": {
    "bage": "node ./dev/bage.js",
    "test": "cross-env NODE_ENV=test karma start ./dev/karma.conf.js",
    "precheck": "npm run eslint && npm run test",
  },
  "devDependencies": {
    "babel-plugin-istanbul": "^4.1.3",
    "chai": "^3.5.0",
    "mocha": "^3.3.0",
    "karma": "^1.6.0",
    "karma-chai": "^0.1.0",
    "karma-chrome-launcher": "^2.1.0",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.3.0",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-webpack": "^2.0.3",
  }
};

const Redux = {
  "dependencies": {
    "redux": "^3.6.0",
    "react-redux": "^5.0.4",
    "redux-thunk": "^2.2.0"
  }
};

const CSSModules = { "dependencies": { "react-css-modules": "^4.0.5" } };
const Router = { "dependencies": { "react-router": "^3.0.0" } };
const RouterRedux = { "dependencies": { "react-router-redux": "^4.0.6" } };

function combine(from, to) {
  Object.keys(to).forEach((k) => {
    if (from.hasOwnProperty(k)) {
      from[k] = Object.assign({}, from[k], to[k]);
    } else {
      from[k] = Object.assign({}, to[k]);
    }
  });
}

module.exports = {
  getPackageJSON: function (props) {
    let d = defaultPackage(props);
    const { redux, cssm, router, testing } = props;
    if (redux) combine(d, Redux);
    if (cssm) combine(d, CSSModules);
    if (router) {
      combine(d, Router);
      if (redux) {
        combine(d, RouterRedux);
      }
    }

    if (testing) combine(d, testPackage);
    console.log(JSON.stringify(d, null, '  '));
    return JSON.stringify(d, null, '  ');
  }
};

