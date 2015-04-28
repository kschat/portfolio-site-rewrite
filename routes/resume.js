'use strict';

var _ = require('lodash')
  , settings = require('../config/settings.json')
  , RequestAsync = require('../lib/RequestAsync')
  , mdRenderer = require('../lib/markdownRenderer')
  , ServerError = require('../lib/ServerError')
  , resumePromise = RequestAsync(settings.resumeUrl)
      .then(function(res) {
        return mdRenderer(res.body, {
          isMarkdown: true,
          propertyName: 'resume',
          viewPath: './views/resume.hbs'
        });
      });

exports.init = function init(app) {
  app.get('/resume', function(req, res, next) {
    resumePromise
      .spread(function(resume, template) {
        return req.xhr
          ? res.send({ content: template(resume) })
          : res.render('resume', resume);
      })

      .catch(_.compose(next, ServerError));
  });
};
