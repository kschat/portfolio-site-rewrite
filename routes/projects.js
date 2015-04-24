'use strict';

var hbs = require('express-handlebars').create()
  , marked = require('marked')
  , fs = require('fs')
  , Promise = require('bluebird')
  , _ = require('lodash')
  , path = require('path')
  , projectJson = require('../config/projects.json')
  , settings = require('../config/settings.json')

  , resolveProjectFile = _.partial(path.resolve, settings.markdownPath)
  , readUtf8FileAsync = _.partialRight(fs.readFileAsync.bind(fs), 'utf-8')
  , readProjectFile = _.compose(readUtf8FileAsync, resolveProjectFile)
  , log = console.log.bind(console);

exports.init = function init(app) {
  app.get('/projects', function(req, res, next) {
    Promise
      .map(projectJson, function(project, index) {
        return readProjectFile(project.aboutPath)
          .then(marked)
          .then(function(md) {
            project.about = md;
            project.href = '/project/' + index;
            return project;
          });
      })

      .then(function(projects) {
        var template = req.xhr
          ? hbs.getTemplate('./views/projects.hbs')
          : null;

        return [{ projects: projects }, template];
      })

      .spread(function(projects, template) {
        return template
          ? res.send({ content: template(projects) })
          : res.render('projects', projects);
      })

      .catch(log);
  });
};
