'use strict';

var hbs = require('express-handlebars').create()
  , fs = require('fs')
  , path = require('path')
  , Promise = require('bluebird')
  , settings = require('../config/settings.json')
  , marked = require('marked')

  , log = console.log.bind(console);

exports.init = function init(app) {
  app.get('/(about)?', function(req, res, next) {
    fs.readFileAsync(path.resolve(settings.markdownPath, 'about.md'), 'utf-8')

      .then(marked)

      .then(function(about) {
        var template = req.xhr
          ? hbs.getTemplate('./views/about.hbs')
          : null;

        return [{ about: about }, template];
      })

      .spread(function(about, template) {

        return template
          ? res.send({ content: template(about) })
          : res.render('about', about);
      })

      .catch(log);
  });

  app.get('/:page?', function(req, res, next) {
    var view = req.params.page || 'about';

    if(view === 'projects') { return next(); }

    if(!req.xhr) { return res.render(view); }

    hbs.getTemplate('./views/' + view + '.hbs')

      .then(function(template) {
        return res.send({ content: template() });
      })

      .catch(function(err) {
        return res.send({ error: 'Error loading page' });
      });
	});
};
