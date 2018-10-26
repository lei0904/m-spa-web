// https://github.com/michael-ciniawsky/postcss-load-config

let px2rem = require('postcss-px2rem-exclude');

module.exports = {
  "plugins": [px2rem({remUnit: 75, exclude: '/node_modules/'})]
}

