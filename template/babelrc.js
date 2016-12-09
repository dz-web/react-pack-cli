/**
 * Created by dz on 16/12/8.
 */

module.exports = (props) => {
  let cfg = {
    "presets": [
      "react",
      "stage-1"
    ],
    "plugins": [
      "transform-decorators-legacy"
    ]
  };

  if (props.ie8) {
    cfg.presets.push(["es2015", { "loose": true }])
  } else {
    cfg.presets.push(["es2015", { "modules": false }])
  }

  if (props.testing) {
    cfg = Object.assign({}, cfg, {
      "env": {
        "test": {
          "plugins": [
            "istanbul"
          ]
        }
      },
    })
  }

  return cfg;

};