'use strict';

var ServerError = require('../lib/ServerError');

module.exports = function(env, opts) {
  return function(error, req, res, next) {
    error = !(error instanceof ServerError)
      ? ServerError(error)
      : error;

    if(env.toLowerCase() === 'production') {
      error.stack = null;
    }

    return res.render('error', { error: error });
  };
};
