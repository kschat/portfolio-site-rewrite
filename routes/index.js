'use strict';

var hbs = require('express-handlebars').create();

exports.init = function init(app) {
  app.get('/:page', function(req, res, next) {
    var view = req.params.page || 'about';

    if(!req.xhr) { return res.render(view); }

    hbs.getTemplate('./views/' + view + '.hbs')

      .then(function(partial) {
        return res.send({ content: partial() });
      })

      .catch(function(err) {
        return res.send({ error: 'Error loading page' });
      });
	});
};
