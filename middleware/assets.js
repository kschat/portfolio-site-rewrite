'use strict';

var _ = require('lodash')

  , mapObject = _.compose(_.object, _.map);

module.exports = function(env, opts) {
  var assets = mapObject(opts || {}, function(opt, key) {
    opt = env.toLowerCase() === 'production'
      ? opt.replace(/(\..+)$/, function(m, ext) { return '.min' + ext; })
      : opt;

    return [key, opt];
  });

  return function(req, res, next) {
    res.locals.assets = assets;

    return next();
  };
};
