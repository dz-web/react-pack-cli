module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "strict": 0,
    "no-console": 0,
    "global-require": 0,
    "jsx-a11y/href-no-hash": 0,
    "react/forbid-prop-types": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    'import/no-dynamic-require': 0,
    'max-len': ["error", 120],
  },
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "globals": {
    "DEBUG":true,
  }
};
