'use strict';

var hbs = require('express-handlebars').create()
  , Promise = require('bluebird')
  , _ = require('lodash')
  , path = require('path')
  , projectJson = require('../config/projects.json')
  , settings = require('../config/settings.json')
  , mdRenderer = require('../lib/markdownRenderer')
  , ServerError = require('../lib/ServerError')

  , mapAndCompact = _.compose(_.compact, _.map)
  , resolveProjectFile = _.partial(path.resolve, settings.markdownPath)
  , renderProjectMarkdown = _.partialRight(mdRenderer, {
      renderTemplate: false,
      wrapInObject: false
    })

    // read each markdown file in the projects.json file and convert it to html
  , projects = Promise.map(projectJson, function(project) {
        return renderProjectMarkdown(resolveProjectFile(project.aboutPath))
          .catch(_.noop);
      })

      .then(function(mds) {
        return mapAndCompact(projectJson, function(project, index) {
          if(!mds[index]) { return null; }

          project.about = mds[index][0];
          project.href = '/project/' + index;

          return project;
        });
      });

exports.init = function init(app) {
  app.get('/projects', function(req, res, next) {
    projects
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

      .catch(_.compose(next, ServerError));
  });
};
