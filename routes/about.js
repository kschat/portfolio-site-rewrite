'use strict';

var path = require('path')
  , _ = require('lodash')
  , settings = require('../config/settings.json')
  , mdRenderer = require('../lib/markdownRenderer')
  , ServerError = require('../lib/ServerError')

exports.init = function init(app) {
  app.get('/(about)?', function(req, res, next) {
    mdRenderer(path.resolve(settings.markdownPath, 'about.md'))

      .spread(function(about, template) {
        return req.xhr
          ? res.send({ content: template(about) })
          : res.render('about', about);
      })

      .catch(_.compose(next, ServerError));
  });
};
