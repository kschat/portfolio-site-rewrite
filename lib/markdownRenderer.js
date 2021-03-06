'use strict';

var hbs = require('express-handlebars').create()
  , marked = require('marked')
  , fs = require('fs')
  , Promise = require('bluebird')
  , _ = require('lodash')
  , path = require('path');

module.exports = function(mdFile, opts) {
  if(!mdFile) { throw Error('Markdown file path required'); }

  var mdFileParts = path.parse(mdFile);

  opts = _.defaults({}, opts || {}, {
    isMarkdown: false,
    readFileSettings: { encoding: 'utf-8' },
    wrapInObject: true,
    propertyName: mdFileParts.name,
    renderTemplate: true,
    viewPath: './views/' + mdFileParts.name + '.hbs'
  });

  var mdPromise = opts.isMarkdown
    ? Promise.resolve(mdFile)
    : fs.readFileAsync(mdFile, opts.readFileSettings);

  return mdPromise

      .then(marked)

      .then(function(md) {
        var result = {}
          , template = opts.renderTemplate
              ? hbs.getTemplate(opts.viewPath)
              : null;

        if(!opts.wrapInObject) { return [md, template]; }

        result[opts.propertyName] = md;

        return [result, template];
      });
};
