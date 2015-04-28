'use strict';

var hbs = require('express-handlebars').create()
  , path = require('path')
  , settings = require('../config/settings.json')
  , mdRenderer = require('../lib/markdownRenderer')
  , ServerError = require('../lib/ServerError')
  , _ = require('lodash');

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

  app.get('/:page?', function(req, res, next) {
    var view = req.params.page || 'about';

    if(view === 'projects') { return next(); }

    if(!req.xhr) { return res.render(view); }

    hbs.getTemplate('./views/' + view + '.hbs')

      .then(function(template) {
        return res.send({ content: template() });
      })

      .catch(_.compose(next, ServerError));
	});
};
